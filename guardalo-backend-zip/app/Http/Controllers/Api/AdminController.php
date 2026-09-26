<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ContractTemplate;
use App\Models\Operation;
use App\Mail\PagoConfirmadoMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * List all registered clients with their active box numbers (Prototype sidebar: CLIENTES).
     */
    public function clients(Request $request)
    {
        $clients = User::where('role', '!=', 'admin')
            ->orWhereNull('role')
            ->with(['operations.box'])
            ->orderBy('id', 'desc')
            ->get();

        $formatted = $clients->map(function ($client) {
            $activeBoxes = $client->operations
                ? $client->operations
                    ->where('payment_status', 'pagado')
                    ->pluck('box.box_number')
                    ->filter()
                    ->values()
                : collect();

            $status = $activeBoxes->count() > 0 ? 'Al día' : 'Sin boxes activos';

            return [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
                'phone' => $client->phone,
                'dni' => $client->dni,
                'cuit' => $client->cuit,
                'city' => $client->city,
                'active_boxes' => $activeBoxes,
                'status' => $status,
                'total_rentals' => $client->operations ? $client->operations->count() : 0,
                'created_at' => $client->created_at ? $client->created_at->format('d/m/Y') : null,
            ];
        });

        return response()->json([
            'success' => true,
            'clients' => $formatted,
        ]);
    }

    /**
     * Get the active contract template (Prototype sidebar: CONTRATO).
     */
    public function getContractTemplate()
    {
        $template = ContractTemplate::where('is_active', true)->first();

        if (!$template) {
            $template = ContractTemplate::create([
                'title' => 'Contrato Estándar de Almacenaje',
                'content' => "CONTRATO DE LOCACIÓN DE ESPACIO DE ALMACENAJE (BOX)\n\nEntre GUARDALO.COM (\"La Locadora\") y el CLIENTE (\"El Locatario\"):\nPRIMERA: El Locatario alquila el espacio individual determinado asignado para almacenamiento temporal de enseres y mercadería no peligrosa.\nSEGUNDA: El pago se efectuará por período anticipado. El vencimiento operará de pleno derecho al término del período contratado.\nTERCERA: Queda prohibido el almacenamiento de sustancias inflamables, tóxicas, ilegales o perecederas.",
                'version' => '1.0',
            ]);
        }

        return response()->json([
            'success' => true,
            'template' => $template,
        ]);
    }

    /**
     * Update contract template.
     */
    public function updateContractTemplate(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'title' => 'sometimes|string',
        ]);

        $template = ContractTemplate::where('is_active', true)->first();

        if ($template) {
            $template->update([
                'content' => $request->content,
                'title' => $request->input('title', $template->title),
            ]);
        } else {
            $template = ContractTemplate::create([
                'title' => $request->input('title', 'Contrato Estándar'),
                'content' => $request->content,
                'version' => '1.1',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Plantilla de contrato guardada exitosamente',
            'template' => $template,
        ]);
    }

    /**
     * List all rental operations (Admin: OPERACIONES).
     */
    public function operations(Request $request)
    {
        $operations = Operation::with(['user', 'box'])
            ->orderBy('id', 'desc')
            ->get();

        $formatted = $operations->map(function ($op) {
            return [
                'id' => $op->id,
                'code' => $op->operation_code,
                'client_name' => $op->user ? $op->user->name : 'Desconocido',
                'client_email' => $op->user ? $op->user->email : '',
                'client_phone' => $op->user ? $op->user->phone : '',
                'box_number' => $op->box ? $op->box->box_number : 'Sin Box',
                'start_date' => $op->start_date ? $op->start_date->format('d/m/Y') : null,
                'end_date' => $op->end_date ? $op->end_date->format('d/m/Y') : null,
                'amount' => (float) $op->amount,
                'payment_status' => $op->payment_status,
                'payment_method' => $op->payment_method,
                'transfer_reference' => $op->transfer_reference,
                'transfer_receipt_path' => $op->transfer_receipt_path,
                'contract_url' => $op->contract_pdf_path,
                'created_at' => $op->created_at ? $op->created_at->format('d/m/Y H:i') : null,
            ];
        });

        return response()->json([
            'success' => true,
            'operations' => $formatted,
        ]);
    }

    /**
     * Approve a bank transfer operation and activate the box.
     */
    public function approveTransfer($id)
    {
        $operation = Operation::with(['user', 'box'])->find($id);

        if (!$operation) {
            return response()->json([
                'success' => false,
                'message' => 'Operación no encontrada.',
            ], 404);
        }

        $operation->update([
            'payment_status' => 'pagado',
            'notes' => trim(($operation->notes ?? '') . ' | Transferencia aprobada manualmente por admin el ' . now()->format('d/m/Y H:i')),
        ]);

        if ($operation->box) {
            $operation->box->update(['status' => 'alquilado']);
        }

        try {
            if ($operation->user && $operation->user->email) {
                Mail::to($operation->user->email)->send(new PagoConfirmadoMail($operation, true));
            }
        } catch (\Exception $e) {
            \Log::warning('Error enviando mail de confirmación de transferencia: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => "Transferencia aprobada. La unidad {$operation->box?->box_number} ha sido activada.",
            'operation' => $operation,
        ]);
    }
}
