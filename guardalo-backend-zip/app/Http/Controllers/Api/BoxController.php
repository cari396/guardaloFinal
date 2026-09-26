<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Box;
use App\Models\Operation;
use Illuminate\Http\Request;

class BoxController extends Controller
{
    /**
     * Get boxes rented by the authenticated user (Prototype Page 2).
     */
    public function myBoxes(Request $request)
    {
        $user = $request->user();

        $operations = Operation::with('box')
            ->where('user_id', $user->id)
            ->where('payment_status', 'pagado')
            ->orderBy('created_at', 'desc')
            ->get();

        $formatted = $operations->map(function ($op) {
            // Format dates nicely in Spanish: e.g. "22 de diciembre"
            $months = [
                1 => 'enero', 2 => 'febrero', 3 => 'marzo', 4 => 'abril',
                5 => 'mayo', 6 => 'junio', 7 => 'julio', 8 => 'agosto',
                9 => 'septiembre', 10 => 'octubre', 11 => 'noviembre', 12 => 'diciembre'
            ];

            $end = \Carbon\Carbon::parse($op->end_date);
            $expiresAt = $end->format('j') . ' de ' . ($months[$end->month] ?? $end->format('F'));

            $start = \Carbon\Carbon::parse($op->start_date);
            $startDate = $start->format('j') . ' de ' . ($months[$start->month] ?? $start->format('F'));

            return [
                'id' => $op->id,
                'operation_code' => $op->operation_code,
                'box_number' => $op->box ? $op->box->box_number : 'BOX',
                'size' => $op->box ? $op->box->size . ': ' . $op->box->dimensions : 'Estándar',
                'expires_at' => $expiresAt,
                'start_date' => $startDate,
                'end_date_raw' => $op->end_date->toDateString(),
                'status' => $op->payment_status,
                'amount' => (float)$op->amount,
                'contract_pdf_url' => $op->contract_pdf_path,
            ];
        });

        return response()->json([
            'success' => true,
            'boxes' => $formatted,
        ]);
    }

    /**
     * Get operations / receipts for the authenticated user.
     */
    public function myOperations(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => true, 'operations' => []]);
        }

        $operations = Operation::with('box')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $formatted = $operations->map(function ($op) {
            return [
                'id' => $op->id,
                'operation_code' => $op->operation_code ?: ('#OP-' . $op->id),
                'box_number' => $op->box ? $op->box->box_number : 'BOX',
                'date' => $op->created_at ? \Carbon\Carbon::parse($op->created_at)->format('d/m/Y') : '22/09/2026',
                'amount' => (float)$op->amount,
                'status' => $op->payment_status ?: 'pagado',
                'payment_method' => $op->payment_method ?: 'mercadopago',
                'transfer_receipt_path' => $op->transfer_receipt_path,
                'transfer_reference' => $op->transfer_reference,
            ];
        });

        return response()->json([
            'success' => true,
            'operations' => $formatted,
        ]);
    }

    /**
     * Get operation details by ID.
     */
    public function operationDetail(Request $request, $id)
    {
        $user = $request->user();

        $operation = Operation::with(['box', 'user'])
            ->where('id', $id)
            ->when(!$user->isAdmin(), function ($q) use ($user) {
                return $q->where('user_id', $user->id);
            })
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'operation' => $operation,
        ]);
    }

    /**
     * List all available boxes for rental.
     */
    public function availableBoxes()
    {
        $boxes = Box::where('status', 'disponible')->get();

        return response()->json([
            'success' => true,
            'boxes' => $boxes,
        ]);
    }

    /**
     * Get availability counts per size (Public for rental form).
     */
    public function availability()
    {
        $sizes = ['Pequeño', 'Mediano', 'Grande'];
        $dimensions = [
            'Pequeño' => '8.3m² (1.66x5m)',
            'Mediano' => '13.75m² (2.75x5m)',
            'Grande'  => '20.5m² (4.10x5m)',
        ];

        $result = [];
        foreach ($sizes as $s) {
            $total = Box::where('size', $s)->count();
            $rented = Box::where('size', $s)->where('status', 'alquilado')->count();
            $available = Box::where('size', $s)->where('status', 'disponible')->count();
            $maintenance = Box::where('size', $s)->where('status', 'mantenimiento')->count();

            $result[$s] = [
                'size' => $s,
                'dimensions' => $dimensions[$s] ?? '',
                'total' => $total,
                'rented' => $rented,
                'available' => $available,
                'maintenance' => $maintenance,
            ];
        }

        return response()->json([
            'success' => true,
            'availability' => $result,
        ]);
    }

    /**
     * Admin index: full list of boxes and summary stats.
     */
    public function adminIndex(Request $request)
    {
        $sizes = ['Pequeño', 'Mediano', 'Grande'];
        $dimensions = [
            'Pequeño' => '8.3m² (1.66x5m)',
            'Mediano' => '13.75m² (2.75x5m)',
            'Grande'  => '20.5m² (4.10x5m)',
        ];

        $summary = [];
        foreach ($sizes as $s) {
            $total = Box::where('size', $s)->count();
            $rented = Box::where('size', $s)->where('status', 'alquilado')->count();
            $available = Box::where('size', $s)->where('status', 'disponible')->count();
            $maintenance = Box::where('size', $s)->where('status', 'mantenimiento')->count();

            $summary[] = [
                'size' => $s,
                'dimensions' => $dimensions[$s] ?? '',
                'total' => $total,
                'rented' => $rented,
                'available' => $available,
                'maintenance' => $maintenance,
            ];
        }

        $boxes = Box::with(['currentOperation.user'])->orderBy('box_number')->get()->map(function ($b) {
            $tenant = null;
            if ($b->currentOperation && $b->currentOperation->user) {
                $tenant = [
                    'id' => $b->currentOperation->user->id,
                    'name' => $b->currentOperation->user->name,
                    'email' => $b->currentOperation->user->email,
                    'phone' => $b->currentOperation->user->phone,
                    'expires_at' => $b->currentOperation->end_date ? $b->currentOperation->end_date->format('d/m/Y') : null,
                ];
            }

            return [
                'id' => $b->id,
                'box_number' => $b->box_number,
                'size' => $b->size,
                'dimensions' => $b->dimensions,
                'status' => $b->status,
                'base_price' => (float)$b->base_price,
                'notes' => $b->notes,
                'tenant' => $tenant,
            ];
        });

        return response()->json([
            'success' => true,
            'summary' => $summary,
            'boxes' => $boxes,
        ]);
    }

    /**
     * Set target total capacity for a size.
     */
    public function setCapacity(Request $request)
    {
        $request->validate([
            'size' => 'required|in:Pequeño,Mediano,Grande',
            'target_total' => 'sometimes|integer|min:0|max:500',
            'total_count' => 'sometimes|integer|min:0|max:500',
        ]);

        $size = $request->size;
        $target = (int)($request->target_total ?? $request->total_count ?? 10);

        $dimensions = [
            'Pequeño' => '8.3m² (1.66x5m)',
            'Mediano' => '13.75m² (2.75x5m)',
            'Grande'  => '20.5m² (4.10x5m)',
        ];

        $currentCount = Box::where('size', $size)->count();

        if ($target > $currentCount) {
            $toAdd = $target - $currentCount;
            // Determine starting box number
            $allNumbers = Box::pluck('box_number')->map(function ($bn) {
                preg_match('/\d+/', $bn, $matches);
                return isset($matches[0]) ? (int)$matches[0] : 0;
            })->all();

            $maxNum = count($allNumbers) > 0 ? max($allNumbers) : 0;

            for ($i = 1; $i <= $toAdd; $i++) {
                $maxNum++;
                Box::create([
                    'box_number' => 'BOX ' . sprintf('%02d', $maxNum),
                    'size' => $size,
                    'dimensions' => $dimensions[$size] ?? '',
                    'status' => 'disponible',
                    'notes' => 'Ajuste de capacidad',
                ]);
            }
        } elseif ($target < $currentCount) {
            $toRemove = $currentCount - $target;
            // Only delete boxes that are 'disponible' (never rented or in maintenance)
            $availableBoxes = Box::where('size', $size)
                ->where('status', 'disponible')
                ->orderBy('id', 'desc')
                ->take($toRemove)
                ->get();

            $deletedCount = $availableBoxes->count();
            foreach ($availableBoxes as $b) {
                $b->delete();
            }

            if ($deletedCount < $toRemove) {
                return response()->json([
                    'success' => true,
                    'message' => "Se eliminaron {$deletedCount} boxes disponibles. Los restantes no pueden borrarse porque están alquilados o en mantenimiento.",
                    'availability' => $this->availability()->getData()->availability,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Capacidad para {$size} actualizada a {$target} boxes.",
            'availability' => $this->availability()->getData()->availability,
        ]);
    }

    /**
     * Store a single box.
     */
    public function store(Request $request)
    {
        $request->validate([
            'box_number' => 'required|string|unique:boxes,box_number',
            'size' => 'required|in:Pequeño,Mediano,Grande',
            'status' => 'sometimes|in:disponible,mantenimiento',
            'notes' => 'nullable|string',
        ]);

        $dimensions = [
            'Pequeño' => '8.3m² (1.66x5m)',
            'Mediano' => '13.75m² (2.75x5m)',
            'Grande'  => '20.5m² (4.10x5m)',
        ];

        $box = Box::create([
            'box_number' => strtoupper(trim($request->box_number)),
            'size' => $request->size,
            'dimensions' => $dimensions[$request->size] ?? '',
            'status' => $request->input('status', 'disponible'),
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Box creado con éxito',
            'box' => $box,
        ]);
    }

    /**
     * Update an individual box.
     */
    public function update(Request $request, $id)
    {
        $box = Box::findOrFail($id);

        $request->validate([
            'box_number' => 'sometimes|string|unique:boxes,box_number,' . $id,
            'size' => 'sometimes|in:Pequeño,Mediano,Grande',
            'status' => 'sometimes|in:disponible,alquilado,mantenimiento',
            'notes' => 'nullable|string',
        ]);

        $dimensions = [
            'Pequeño' => '8.3m² (1.66x5m)',
            'Mediano' => '13.75m² (2.75x5m)',
            'Grande'  => '20.5m² (4.10x5m)',
        ];

        if ($request->has('size')) {
            $box->size = $request->size;
            $box->dimensions = $dimensions[$request->size] ?? $box->dimensions;
        }

        if ($request->has('box_number')) {
            $box->box_number = strtoupper(trim($request->box_number));
        }

        if ($request->has('status')) {
            $box->status = $request->status;
        }

        if ($request->has('notes')) {
            $box->notes = $request->notes;
        }

        $box->save();

        return response()->json([
            'success' => true,
            'message' => 'Box actualizado con éxito',
            'box' => $box,
        ]);
    }

    /**
     * Destroy a box.
     */
    public function destroy($id)
    {
        $box = Box::findOrFail($id);

        if ($box->status === 'alquilado') {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar un box que se encuentra alquilado.',
            ], 422);
        }

        $box->delete();

        return response()->json([
            'success' => true,
            'message' => 'Box eliminado correctamente',
        ]);
    }
}
