<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Operation;
use App\Models\Box;
use App\Services\MercadoPagoService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Validator;

class PaymentController extends Controller
{
    protected MercadoPagoService $mpService;

    public function __construct(MercadoPagoService $mpService)
    {
        $this->mpService = $mpService;
    }

    /**
     * Get official bank details for bank transfers.
     */
    public function getBankDetails()
    {
        $bank = config('mercadopago.bank', [
            'bank_name'      => 'Banco Santander Río',
            'account_holder' => 'Guardalo S.R.L.',
            'cuit'           => '30-71649281-9',
            'cbu'            => '0720218820000001234567',
            'alias'          => 'GUARDALO.BOXES',
            'account_type'   => 'Cuenta Corriente en Pesos',
            'instructions'   => 'Transferí el importe total y adjuntá tu comprobante para confirmar tu box.',
        ]);

        return response()->json([
            'success' => true,
            'bank'    => $bank,
        ]);
    }

    /**
     * Create a Mercado Pago Checkout Preference for a rental or renewal.
     */
    public function createPreference(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount'         => 'required|numeric|min:1',
            'title'          => 'required|string',
            'operation_code' => 'nullable|string',
            'email'          => 'nullable|email',
            'name'           => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos para generar el pago.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $operationCode = $request->get('operation_code', '#OP-' . rand(1000, 9999));
        $cleanOp = str_replace(['#', ' '], '', $operationCode);

        // Find operation if exists
        $operation = Operation::where('operation_code', $operationCode)
            ->orWhere('operation_code', 'LIKE', '%' . $cleanOp . '%')
            ->first();

        $title = $request->get('title');
        if ($operation && $operation->box) {
            $title = "Alquiler {$operation->box->box_number} ({$operation->box->size}) - Guardalo.com";
        }

        $prefResult = $this->mpService->createPreference([
            'title'          => $title,
            'amount'         => (float) $request->get('amount'),
            'operation_code' => $operationCode,
            'payer_email'    => $request->get('email') ?: ($operation && $operation->user ? $operation->user->email : 'cliente@guardalo.com.ar'),
            'payer_name'     => $request->get('name') ?: ($operation && $operation->user ? $operation->user->name : 'Cliente Guardalo'),
        ]);

        if (!$prefResult['success']) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo generar la preferencia de Mercado Pago.',
            ], 500);
        }

        // Store preference ID in Operation if operation exists
        if ($operation) {
            $updateData = [
                'payment_method' => 'mercadopago',
                'payment_status' => 'pendiente_mercadopago',
            ];
            if (Schema::hasColumn('operations', 'mercadopago_preference_id')) {
                $updateData['mercadopago_preference_id'] = $prefResult['preference_id'];
            }
            $updateData['notes'] = trim(($operation->notes ?? '') . " | MP Pref: {$prefResult['preference_id']}");
            $operation->update($updateData);
        }

        return response()->json([
            'success'            => true,
            'preference_id'      => $prefResult['preference_id'],
            'init_point'         => $prefResult['init_point'],
            'sandbox_init_point' => $prefResult['sandbox_init_point'],
            'is_mock'            => $prefResult['is_mock'] ?? false,
            'operation_code'     => $operationCode,
            'message'            => 'Preferencia de Mercado Pago generada con éxito.',
        ]);
    }

    /**
     * Process a direct card payment (Credit / Debit card).
     */
    public function processCard(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'card_number'      => 'required|string',
            'card_holder'      => 'required|string',
            'expiration_month' => 'required|numeric',
            'expiration_year'  => 'required|numeric',
            'cvv'              => 'required|string',
            'amount'           => 'required|numeric|min:1',
            'operation_code'   => 'required|string',
            'installments'     => 'nullable|numeric',
            'dni'              => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Por favor, completá correctamente todos los datos de la tarjeta.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // Process through payment service
        $cardResult = $this->mpService->processCardPayment($request->all());

        if (!$cardResult['success']) {
            return response()->json([
                'success' => false,
                'message' => $cardResult['message'],
            ], 422);
        }

        $operationCode = $request->get('operation_code');
        $cleanOp = str_replace(['#', ' '], '', $operationCode);

        // Find or locate the operation
        $operation = Operation::where('operation_code', $operationCode)
            ->orWhere('operation_code', 'LIKE', '%' . $cleanOp . '%')
            ->first();

        $paymentMethodLabel = "Tarjeta {$cardResult['card_brand']} (**** {$cardResult['card_last_four']}) - {$cardResult['installments']} pago(s)";

        if ($operation) {
            $updateData = [
                'payment_status' => 'pagado',
                'payment_method' => $paymentMethodLabel,
            ];

            if (Schema::hasColumn('operations', 'card_last_four')) {
                $updateData['card_last_four'] = $cardResult['card_last_four'];
                $updateData['card_brand'] = $cardResult['card_brand'];
                $updateData['installments'] = $cardResult['installments'];
            }

            $authNote = "Pago Aprobado: {$cardResult['authorization_code']} | Transacción: {$cardResult['transaction_id']} | Titular: {$cardResult['card_holder']}";
            $updateData['notes'] = trim(($operation->notes ?? '') . ' | ' . $authNote);

            $operation->update($updateData);

            // Ensure the assigned box is marked rented
            if ($operation->box) {
                $operation->box->update(['status' => 'alquilado']);
            }
        }

        return response()->json([
            'success'            => true,
            'message'            => '¡Pago con tarjeta aprobado exitosamente!',
            'authorization_code' => $cardResult['authorization_code'],
            'transaction_id'     => $cardResult['transaction_id'],
            'card_brand'         => $cardResult['card_brand'],
            'card_last_four'     => $cardResult['card_last_four'],
            'installments'       => $cardResult['installments'],
            'operation_code'     => $operationCode,
        ]);
    }

    /**
     * Confirm a bank transfer payment with transfer reference and optional receipt attachment.
     */
    public function confirmTransfer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'operation_code'     => 'required|string',
            'transfer_reference' => 'required|string|max:100',
            'receipt_file'       => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Por favor, ingresá el número de comprobante o referencia de tu transferencia.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $operationCode = $request->get('operation_code');
        $cleanOp = str_replace(['#', ' '], '', $operationCode);

        $operation = Operation::where('operation_code', $operationCode)
            ->orWhere('operation_code', 'LIKE', '%' . $cleanOp . '%')
            ->first();

        if (!$operation) {
            return response()->json([
                'success' => false,
                'message' => 'Operación no encontrada para registrar la transferencia.',
            ], 404);
        }

        $receiptPath = null;
        if ($request->hasFile('receipt_file')) {
            $file = $request->file('receipt_file');
            $filename = 'comprobante_' . $cleanOp . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('comprobantes', $filename, 'public');
            $receiptPath = '/storage/' . $path;
        }

        $updateData = [
            'payment_status' => 'pendiente_transferencia',
            'payment_method' => 'Transferencia Bancaria',
        ];

        if (Schema::hasColumn('operations', 'transfer_reference')) {
            $updateData['transfer_reference'] = $request->get('transfer_reference');
        }
        if ($receiptPath && Schema::hasColumn('operations', 'transfer_receipt_path')) {
            $updateData['transfer_receipt_path'] = $receiptPath;
        }

        $noteInfo = "Comprobante Transferencia Ref: {$request->get('transfer_reference')}" . ($receiptPath ? " ({$receiptPath})" : "");
        $updateData['notes'] = trim(($operation->notes ?? '') . ' | ' . $noteInfo);

        $operation->update($updateData);

        return response()->json([
            'success'            => true,
            'message'            => 'Comprobante de transferencia registrado con éxito. Nuestro equipo verificará el acreditamiento a la brevedad.',
            'operation_code'     => $operation->operation_code,
            'payment_status'     => 'pendiente_transferencia',
            'transfer_reference' => $request->get('transfer_reference'),
            'receipt_url'        => $receiptPath,
        ]);
    }

    /**
     * Get installment calculations from Mercado Pago API or financing engine.
     */
    public function getInstallments(Request $request)
    {
        $amount = (float) $request->get('amount', 0);
        $bin = $request->get('bin');

        if ($amount <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'El monto debe ser mayor a 0.',
                'installments' => [],
            ], 422);
        }

        $result = $this->mpService->getInstallments($amount, $bin);

        return response()->json([
            'success'           => true,
            'source'            => $result['source'] ?? 'mercadopago',
            'amount'            => $amount,
            'issuer'            => $result['issuer'] ?? null,
            'payment_method_id' => $result['payment_method_id'] ?? null,
            'installments'      => $result['installments'] ?? [],
        ]);
    }

    /**
     * Webhook / IPN notification receiver for Mercado Pago.
     */
    public function webhook(Request $request)
    {
        $topic = $request->get('topic') ?: $request->get('type');
        $id = $request->get('id') ?: $request->input('data.id');

        Log::info("MercadoPago Webhook received: topic={$topic}, id={$id}");

        if ($topic === 'payment' && $id) {
            $payment = $this->mpService->getPayment($id);

            if ($payment && isset($payment['status']) && $payment['status'] === 'approved') {
                $externalRef = $payment['external_reference'] ?? null;

                if ($externalRef) {
                    $cleanOp = str_replace(['#', ' '], '', $externalRef);
                    $operation = Operation::where('operation_code', $externalRef)
                        ->orWhere('operation_code', 'LIKE', '%' . $cleanOp . '%')
                        ->first();

                    if ($operation) {
                        $updateData = [
                            'payment_status' => 'pagado',
                            'payment_method' => 'Mercado Pago (Aprobado)',
                        ];
                        if (Schema::hasColumn('operations', 'mercadopago_payment_id')) {
                            $updateData['mercadopago_payment_id'] = (string) $id;
                        }
                        $updateData['notes'] = trim(($operation->notes ?? '') . " | MP Pago #{$id} Aprobado");
                        $operation->update($updateData);

                        if ($operation->box) {
                            $operation->box->update(['status' => 'alquilado']);
                        }

                        Log::info("Operación {$operation->operation_code} actualizada a pagado vía Webhook MP.");

                        // Enviar emails de confirmación de pago
                        try {
                            $adminEmail = config('mail.from.address', 'contacto@guardalo.com.ar');
                            if ($adminEmail) {
                                \Illuminate\Support\Facades\Mail::to($adminEmail)
                                    ->send(new \App\Mail\PagoConfirmadoMail($operation, false));
                            }
                            if ($operation->user && $operation->user->email) {
                                \Illuminate\Support\Facades\Mail::to($operation->user->email)
                                    ->send(new \App\Mail\PagoConfirmadoMail($operation, true));
                            }
                        } catch (\Exception $mailEx) {
                            Log::warning('No se pudo enviar email de confirmación de pago: ' . $mailEx->getMessage());
                        }
                    }
                }
            }
        }

        return response()->json(['status' => 'ok'], 200);
    }
}
