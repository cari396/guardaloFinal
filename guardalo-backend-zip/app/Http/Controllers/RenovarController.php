<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Box;
use App\Models\Operation;
use App\Models\Price;
use App\Services\MercadoPagoService;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Validator;

class RenovarController extends Controller
{
    /**
     * Process a box renewal, extending its expiration date with payment support.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function renovar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'box_number' => 'required|string',
            'email'      => 'nullable|email',
            'days'       => 'required|numeric|min:1',
            'price'      => 'required|numeric|min:1',
            'payment'    => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida al procesar la renovación.',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 1. Identificar al usuario (Sanctum o Email verificado)
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

        if (!$user && $request->filled('email')) {
            $user = User::where('email', strtolower(trim($request->email)))->first();
        }

        $emailToUse = $user ? $user->email : ($request->email ?: 'cliente@guardalo.com.ar');

        // 2. Buscar el Box de forma flexible
        $boxNumber = trim($request->box_number);
        $box = Box::where('box_number', $boxNumber)
            ->orWhere('box_number', strtoupper($boxNumber))
            ->first();

        if (!$box) {
            $numOnly = preg_replace('/[^0-9]/', '', $boxNumber);
            $box = Box::where('box_number', 'BOX ' . $numOnly)
                ->orWhere('box_number', 'Box ' . $numOnly)
                ->first();
        }

        if (!$box) {
            $box = Box::firstOrCreate(
                ['box_number' => 'BOX ' . ($numOnly ?: '16')],
                ['size' => 'Mediano', 'dimensions' => '13.75m² (2.75x5m)', 'status' => 'alquilado', 'base_price' => 60000]
            );
        }

        // 3. Protección contra Price Tampering en renovación
        $days = (int)$request->days;
        $matchedPrice = Price::where('size_category', 'LIKE', '%' . ($box->size ?: 'Mediano') . '%')
            ->where(function ($q) use ($days) {
                $q->where('period', 'LIKE', $days . ' %')
                  ->orWhere('period', 'LIKE', '%' . $days . ' D%')
                  ->orWhere('period', $days . ' DÍAS');
            })
            ->where('is_active', true)
            ->first();

        $clientPrice = (float)$request->price;
        if ($matchedPrice && (float)$matchedPrice->amount > 0) {
            $expectedPrice = (float)$matchedPrice->amount;
            if ($clientPrice < ($expectedPrice * 0.90) || $clientPrice > ($expectedPrice * 1.5)) {
                $validatedAmount = $expectedPrice;
            } else {
                $validatedAmount = $clientPrice;
            }
        } else {
            $validatedAmount = max($clientPrice, 5000);
        }

        // 4. Buscar la última operación activa del box para encadenar las fechas
        $lastOp = Operation::where('box_id', $box->id)
            ->where('payment_status', 'pagado')
            ->orderBy('end_date', 'desc')
            ->first();

        $startDate = $lastOp && Carbon::parse($lastOp->end_date)->isFuture()
            ? Carbon::parse($lastOp->end_date)->addDay()
            : Carbon::now();

        $endDate = (clone $startDate)->addDays($days);

        // 5. Procesar Medio de Pago (Tarjeta, Mercado Pago, Transferencia)
        $rawPayment = strtolower($request->payment ?? 'mercadopago');
        $isMercadoPago = str_contains($rawPayment, 'mercadopago') || str_contains($rawPayment, 'mercado pago') || str_contains($rawPayment, 'mp');
        $isTransfer = str_contains($rawPayment, 'transferencia') || str_contains($rawPayment, 'cbu');
        $hasCardData = $request->filled('card_number');

        $mpService = app(MercadoPagoService::class);
        $cardDetails = null;
        $mpDetails = null;
        $paymentStatus = 'pagado';
        $paymentMethodLabel = $request->payment ?? 'Tarjeta / Mercado Pago';

        if ($hasCardData) {
            $cardResult = $mpService->processCardPayment([
                'card_number'      => $request->card_number,
                'card_holder'      => $request->card_holder ?? ($user ? $user->name : 'Cliente Guardalo'),
                'expiration_month' => $request->expiration_month,
                'expiration_year'  => $request->expiration_year,
                'cvv'              => $request->cvv,
                'amount'           => $validatedAmount,
                'installments'     => (int)($request->installments ?? 1),
            ]);

            if (!$cardResult['success']) {
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

        // 6. Crear la Operación de Renovación en Base de Datos (Código único a prueba de duplicados)
        do {
            $operationCode = '#REN-' . mt_rand(100000, 999999);
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
                \Log::warning('No se pudo guardar archivo de comprobante: ' . $e->getMessage());
            }
        }

        $operationData = [
            'operation_code' => $operationCode,
            'user_id'        => $user ? $user->id : ($lastOp ? $lastOp->user_id : 1),
            'box_id'         => $box->id,
            'start_date'     => $startDate->toDateString(),
            'end_date'       => $endDate->toDateString(),
            'amount'         => $validatedAmount,
            'payment_status' => $paymentStatus,
            'payment_method' => $paymentMethodLabel,
            'notes'          => 'Renovación de ' . $box->box_number . ' por ' . $days . ' días',
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
                $operationData['transfer_reference'] = $request->transfer_reference;
            }
            $operationData['notes'] .= " | Ref: {$request->transfer_reference}";
        }

        if ($receiptPath && Schema::hasColumn('operations', 'transfer_receipt_path')) {
            $operationData['transfer_receipt_path'] = $receiptPath;
            $operationData['notes'] .= " | Comprobante Adjunto: {$receiptPath}";
        }

        $operation = Operation::create($operationData);

        // Si es Mercado Pago, generar preferencia
        if ($isMercadoPago) {
            $prefResult = $mpService->createPreference([
                'title'          => "Renovación {$box->box_number} ({$days} días) - Guardalo.com",
                'amount'         => $validatedAmount,
                'operation_code' => $operation->operation_code,
                'payer_email'    => $emailToUse,
                'payer_name'     => $user ? $user->name : 'Cliente Guardalo',
            ]);
            if ($prefResult['success']) {
                $mpDetails = $prefResult;
                if (Schema::hasColumn('operations', 'mercadopago_preference_id')) {
                    $operation->update(['mercadopago_preference_id' => $prefResult['preference_id']]);
                }
            }
        }

        $months = [
            1 => 'enero', 2 => 'febrero', 3 => 'marzo', 4 => 'abril',
            5 => 'mayo', 6 => 'junio', 7 => 'julio', 8 => 'agosto',
            9 => 'septiembre', 10 => 'octubre', 11 => 'noviembre', 12 => 'diciembre'
        ];
        $newExpiresAt = $endDate->format('j') . ' de ' . ($months[$endDate->month] ?? $endDate->format('F')) . ' de ' . $endDate->year;

        // 7. Enviar emails de notificación de renovación
        try {
            $adminEmail = config('mail.from.address', 'contacto@guardalo.com.ar');
            Mail::to($adminEmail)
                ->send(new \App\Mail\RenovarMail(
                    $box->box_number,
                    $emailToUse,
                    $days,
                    $operation->amount,
                    $paymentMethodLabel,
                    $newExpiresAt,
                    $operation->operation_code,
                    false
                ));

            if ($emailToUse && filter_var($emailToUse, FILTER_VALIDATE_EMAIL)) {
                Mail::to($emailToUse)
                    ->send(new \App\Mail\RenovarMail(
                        $box->box_number,
                        $emailToUse,
                        $days,
                        $operation->amount,
                        $paymentMethodLabel,
                        $newExpiresAt,
                        $operation->operation_code,
                        true
                    ));
            }
        } catch (\Exception $mailEx) {
            Log::warning('No se pudo enviar email de renovación: ' . $mailEx->getMessage());
        }

        $resp = [
            'success' => true,
            'message' => $isTransfer
                ? 'Solicitud de renovación registrada. Realizá la transferencia para completar la acreditación.'
                : ($isMercadoPago ? 'Renovación iniciada. Conectando con Mercado Pago...' : '¡Renovación procesada con éxito!'),
            'operation' => [
                'id'                   => $operation->id,
                'code'                 => $operation->operation_code,
                'box'                  => $box->box_number,
                'start_date'           => $startDate->toDateString(),
                'end_date'             => $endDate->toDateString(),
                'expires_at_formatted' => $newExpiresAt,
                'amount'               => $operation->amount,
                'payment_status'       => $operation->payment_status,
                'payment_method'       => $operation->payment_method,
            ],
            'box_number'     => $box->box_number,
            'new_expires_at' => $newExpiresAt,
        ];

        if ($cardDetails) {
            $resp['card'] = $cardDetails;
        }
        if ($mpDetails) {
            $resp['mercadopago'] = $mpDetails;
        }
        if ($isTransfer) {
            $resp['bank'] = config('mercadopago.bank');
        }

        return response()->json($resp);
    }
}
