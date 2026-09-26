<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Box;
use App\Models\Operation;
use App\Models\Price;
use App\Mail\AlquilarMail;
use App\Services\MercadoPagoService;
use Carbon\Carbon;
use Validator;

class Alquilar extends Controller
{
    /**
     * Handle the incoming rental request with full payment processing and security validation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(Request $request)
    {
        // 1. Validación exhaustiva de los datos de entrada
        $validator = Validator::make($request->all(), [
            'name'       => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'dni'        => 'required|string|max:20',
            'email'      => 'required|email|max:150',
            'message'    => 'nullable|string|max:1000',
            'cellphone'  => 'required|string|max:30',
            'phone'      => 'nullable|string|max:30',
            'city'       => 'required|string|max:100',
            'address'    => 'required|string|max:255',
            'cuit'       => 'required|string|max:30',
            'factura'    => 'required|string|max:50',
            'tos'        => 'required',
            'time'       => 'required|numeric|min:1',
            'start'      => 'required',
            'end'        => 'required',
            'price'      => 'required|numeric|min:1',
            'size'       => 'nullable|string',
            'payment'    => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida. Por favor, revisá los campos obligatorios.',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 2. Control de Seguridad: Autenticación obligatoria de cliente
        $user = $request->user('sanctum');

        if (!$user && $request->bearerToken()) {
            $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($request->bearerToken());
            if ($tokenModel) {
                $user = $tokenModel->tokenable;
            }
        }

        if (!$user && $request->filled('auth_token')) {
            $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($request->get('auth_token'));
            if ($tokenModel) {
                $user = $tokenModel->tokenable;
            }
        }

        // Si el usuario no está autenticado vía Sanctum, rechazar la operación
        if (!$user) {
            // Si el email coincide con un usuario existente pero no presentó token, requerir inicio de sesión
            $existing = User::where('email', strtolower(trim($request->get('email'))))->first();
            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ya existe una cuenta con este email. Por favor, iniciá sesión para alquilar tu box.',
                ], 401);
            }

            return response()->json([
                'success' => false,
                'message' => 'Debés registrarte o iniciar sesión en tu cuenta para alquilar un box.',
            ], 401);
        }

        // Actualizar datos del usuario autenticado con la información fresca del alquiler
        $fullName = trim($request->get('name') . ' ' . $request->get('last_name'));
        $user->update([
            'name'      => $fullName ?: $user->name,
            'dni'       => $request->get('dni') ?: $user->dni,
            'cellphone' => $request->get('cellphone') ?: $user->cellphone,
            'phone'     => $request->get('phone') ?: $user->phone,
            'city'      => $request->get('city') ?: $user->city,
            'address'   => $request->get('address') ?: $user->address,
            'cuit'      => $request->get('cuit') ?: $user->cuit,
        ]);

        // 3. Normalizar tamaño solicitado
        $rawSize = $request->get('size', 'Mediano');
        if (stripos($rawSize, 'peque') !== false) {
            $size = 'Pequeño';
        } elseif (stripos($rawSize, 'gran') !== false) {
            $size = 'Grande';
        } else {
            $size = 'Mediano';
        }

        // 4. Protección contra Price Tampering (Validación de precio contra base de datos)
        $days = (int)$request->get('time');
        $matchedPrice = Price::where('size_category', 'LIKE', '%' . $size . '%')
            ->where(function ($q) use ($days) {
                $q->where('period', 'LIKE', $days . ' %')
                  ->orWhere('period', 'LIKE', '%' . $days . ' D%')
                  ->orWhere('period', $days . ' DÍAS');
            })
            ->where('is_active', true)
            ->first();

        $clientPrice = (float)$request->get('price');
        if ($matchedPrice && (float)$matchedPrice->amount > 0) {
            $expectedPrice = (float)$matchedPrice->amount;
            // Si el cliente envía un precio significativamente menor al de la base de datos, imponer el precio real
            if ($clientPrice < ($expectedPrice * 0.90) || $clientPrice > ($expectedPrice * 1.5)) {
                $validatedAmount = $expectedPrice;
            } else {
                $validatedAmount = $clientPrice;
            }
        } else {
            $validatedAmount = max($clientPrice, 3000);
        }

        // 5. Asignación atómica de Box disponible con bloqueo de concurrencia
        $box = null;
        try {
            $box = DB::transaction(function () use ($size) {
                $b = Box::where('size', $size)
                    ->where('status', 'disponible')
                    ->orderBy('id', 'asc')
                    ->lockForUpdate()
                    ->first();

                if ($b) {
                    $b->update(['status' => 'alquilado']);
                }
                return $b;
            });
        } catch (\Exception $dbEx) {
            Log::error("Error locking box for rental: " . $dbEx->getMessage());
        }

        if (!$box) {
            return response()->json([
                'success' => false,
                'message' => "Lo sentimos, no hay boxes disponibles en tamaño {$size} en este momento. Podés elegir otro tamaño o consultarnos por lista de espera.",
            ], 422);
        }

        // 6. Parsear fechas de ingreso y egreso
        try {
            $startDate = Carbon::createFromFormat('d/m/Y', $request->get('start'))->toDateString();
        } catch (\Exception $e) {
            $startDate = Carbon::parse($request->get('start'))->toDateString();
        }

        try {
            $endDate = Carbon::createFromFormat('d/m/Y', $request->get('end'))->toDateString();
        } catch (\Exception $e) {
            $endDate = Carbon::parse($request->get('end'))->toDateString();
        }

        // 7. Evitar duplicados por doble clic accidental en los últimos 20 segundos
        $existingOp = Operation::where('user_id', $user->id)
            ->where('start_date', $startDate)
            ->where('end_date', $endDate)
            ->where('amount', $validatedAmount)
            ->where('created_at', '>=', Carbon::now()->subSeconds(20))
            ->first();

        if ($existingOp) {
            $operation = $existingOp;
            $box = Box::find($existingOp->box_id) ?: $box;
            $contractUrl = url('/contract/' . str_replace('#', '', $operation->operation_code));
            return response()->json([
                'success'   => true,
                'message'   => 'Alquiler registrado con éxito',
                'operation' => [
                    'id'             => $operation->id,
                    'code'           => $operation->operation_code,
                    'box'            => $box->box_number,
                    'start_date'     => $startDate,
                    'end_date'       => $endDate,
                    'amount'         => $operation->amount,
                    'payment_status' => $operation->payment_status,
                ],
                'user' => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                ],
                'url'          => $contractUrl,
                'contract_url' => $contractUrl,
            ], 200);
        }

        // 8. Procesamiento del Medio de Pago (Tarjeta, Mercado Pago, Transferencia)
        $rawPayment = strtolower($request->get('payment', 'tarjeta'));
        $isMercadoPago = str_contains($rawPayment, 'mercadopago') || str_contains($rawPayment, 'mercado pago') || str_contains($rawPayment, 'mp');
        $isTransfer = str_contains($rawPayment, 'transferencia') || str_contains($rawPayment, 'cbu');
        $hasCardData = $request->filled('card_number');

        $mpService = app(MercadoPagoService::class);
        $cardDetails = null;
        $mpDetails = null;
        $paymentStatus = 'pagado';
        $paymentMethodLabel = $request->get('payment', 'Tarjeta de Crédito');

        // A. Pago Directo con Tarjeta (Crédito / Débito)
        if ($hasCardData) {
            $cardResult = $mpService->processCardPayment([
                'card_number'      => $request->get('card_number'),
                'card_holder'      => $request->get('card_holder', $fullName),
                'expiration_month' => $request->get('expiration_month'),
                'expiration_year'  => $request->get('expiration_year'),
                'cvv'              => $request->get('cvv'),
                'amount'           => $validatedAmount,
                'installments'     => (int)$request->get('installments', 1),
            ]);

            if (!$cardResult['success']) {
                // Revertir estado del box si la tarjeta fue rechazada
                $box->update(['status' => 'disponible']);

                return response()->json([
                    'success' => false,
                    'message' => $cardResult['message'],
                ], 422);
            }

            $cardDetails = $cardResult;
            $paymentStatus = 'pagado';
            $paymentMethodLabel = "Tarjeta {$cardResult['card_brand']} (**** {$cardResult['card_last_four']}) - {$cardResult['installments']} cuota(s)";
        } elseif ($isMercadoPago) {
            $paymentStatus = 'pendiente_mercadopago';
            $paymentMethodLabel = 'Mercado Pago';
        } elseif ($isTransfer) {
            $paymentStatus = 'pendiente_transferencia';
            $paymentMethodLabel = 'Transferencia Bancaria';
        }

        // 9. Crear la Operación / Contrato en Base de Datos (Código único a prueba de duplicados)
        do {
            $operationCode = '#OP-' . mt_rand(100000, 999999);
        } while (Operation::where('operation_code', $operationCode)->exists());

        $receiptPath = null;
        if ($isTransfer && ($request->hasFile('receipt_file') || $request->hasFile('transfer_receipt'))) {
            try {
                $file = $request->file('receipt_file') ?: $request->file('transfer_receipt');
                $cleanOp = str_replace('#', '', $operationCode);
                $filename = 'comprobante_' . $cleanOp . '_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('comprobantes', $filename, 'public');
                $receiptPath = '/storage/' . $path;
            } catch (\Exception $e) {
                Log::warning('No se pudo guardar archivo de comprobante: ' . $e->getMessage());
            }
        }

        $operationData = [
            'operation_code' => $operationCode,
            'user_id'        => $user->id,
            'box_id'         => $box->id,
            'start_date'     => $startDate,
            'end_date'       => $endDate,
            'amount'         => $validatedAmount,
            'payment_status' => $paymentStatus,
            'payment_method' => $paymentMethodLabel,
            'notes'          => 'Alquiler procesado vía web para ' . $fullName,
        ];

        if ($cardDetails) {
            if (Schema::hasColumn('operations', 'card_last_four')) {
                $operationData['card_last_four'] = $cardDetails['card_last_four'];
                $operationData['card_brand'] = $cardDetails['card_brand'];
                $operationData['installments'] = $cardDetails['installments'];
            }
            $operationData['notes'] .= " | Pago Aprobado: {$cardDetails['authorization_code']} | Transacción: {$cardDetails['transaction_id']}";
        }

        if ($isTransfer && $request->filled('transfer_reference')) {
            if (Schema::hasColumn('operations', 'transfer_reference')) {
                $operationData['transfer_reference'] = $request->get('transfer_reference');
            }
            $operationData['notes'] .= " | Ref Transferencia: {$request->get('transfer_reference')}";
        }

        if ($receiptPath && Schema::hasColumn('operations', 'transfer_receipt_path')) {
            $operationData['transfer_receipt_path'] = $receiptPath;
            $operationData['notes'] .= " | Comprobante Adjunto: {$receiptPath}";
        }

        $operation = Operation::create($operationData);

        $contractUrl = url('/contract/' . str_replace('#', '', $operation->operation_code));
        $operation->update(['contract_pdf_path' => $contractUrl]);

        // Si eligió Mercado Pago, crear Checkout Preference
        if ($isMercadoPago) {
            $prefResult = $mpService->createPreference([
                'title'          => "Alquiler {$box->box_number} ({$size}) - Guardalo.com",
                'amount'         => $validatedAmount,
                'operation_code' => $operation->operation_code,
                'payer_email'    => $user->email,
                'payer_name'     => $user->name,
            ]);

            if ($prefResult['success']) {
                $mpDetails = $prefResult;
                if (Schema::hasColumn('operations', 'mercadopago_preference_id')) {
                    $operation->update(['mercadopago_preference_id' => $prefResult['preference_id']]);
                }
                $operation->update([
                    'notes' => trim($operation->notes . " | MP Pref: {$prefResult['preference_id']}"),
                ]);
            }
        }

        // 10. Enviar correos de notificación al cliente y a administración
        try {
            $adminEmail = config('mail.from.address', 'contacto@guardalo.com.ar');
            $recipients = array_unique([$adminEmail, $user->email]);
            $bankDetails = $isTransfer ? [
                'bank_name'      => env('BANK_NAME', 'Banco Santander Río'),
                'account_holder' => env('BANK_ACCOUNT_HOLDER', 'Guardalo S.R.L.'),
                'cuit'           => env('BANK_CUIT', '30-71649281-9'),
                'cbu'            => env('BANK_CBU', '0720218820000001234567'),
                'alias'          => env('BANK_ALIAS', 'GUARDALO.BOXES'),
                'account_type'   => env('BANK_ACCOUNT_TYPE', 'Cuenta Corriente en Pesos'),
            ] : null;

            foreach ($recipients as $recipient) {
                Mail::to($recipient)
                    ->send(new AlquilarMail(
                        $request->get('name'),
                        $user->email,
                        $request->get('message'),
                        $request->get('last_name'),
                        $request->get('dni'),
                        $request->get('cellphone'),
                        $request->get('phone'),
                        $request->get('city'),
                        $request->get('address'),
                        $request->get('cuit'),
                        $request->get('factura'),
                        $request->get('tos'),
                        $request->get('time'),
                        $request->get('start'),
                        $request->get('end'),
                        $validatedAmount,
                        $recipient !== $adminEmail,
                        $paymentMethodLabel,
                        $size,
                        $box->box_number,
                        $contractUrl,
                        $operation->operation_code,
                        $bankDetails
                    ));
            }

            // Si fue pago con tarjeta ya aprobado, enviar confirmación de pago oficial
            if ($isCard && $operation->payment_status === 'pagado') {
                Mail::to($user->email)->send(new \App\Mail\PagoConfirmadoMail($operation, true));
            }
        } catch (\Exception $mailEx) {
            Log::warning('No se pudo enviar el email de alquiler: ' . $mailEx->getMessage());
        }

        $responseData = [
            'success' => true,
            'message' => $isTransfer
                ? 'Reserva de box registrada con éxito. Realizá la transferencia a los datos provistos para completar la activación.'
                : ($isMercadoPago ? 'Alquiler registrado. Redirigiendo a Mercado Pago...' : '¡Alquiler y pago confirmados con éxito!'),
            'operation' => [
                'id'             => $operation->id,
                'code'           => $operation->operation_code,
                'box'            => $box->box_number,
                'start_date'     => $startDate,
                'end_date'       => $endDate,
                'amount'         => $operation->amount,
                'payment_status' => $operation->payment_status,
                'payment_method' => $operation->payment_method,
            ],
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
            'url'          => $contractUrl,
            'contract_url' => $contractUrl,
        ];

        if ($cardDetails) {
            $responseData['card'] = $cardDetails;
        }
        if ($mpDetails) {
            $responseData['mercadopago'] = $mpDetails;
        }
        if ($isTransfer) {
            $responseData['bank'] = config('mercadopago.bank');
        }

        return response()->json($responseData, 201);
    }
}
