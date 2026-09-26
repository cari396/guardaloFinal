<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Price;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PriceController extends Controller
{
    /**
     * Get list of active prices (Prototype Page 1).
     */
    public function index()
    {
        $prices = Price::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->orderBy('amount', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'prices' => $prices,
        ]);
    }

    /**
     * Create a new price plan (Prototype Page 1 - "+ AÑADIR NUEVO PRECIO").
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'period' => 'required|string|max:50',
            'amount' => 'required|numeric|min:0',
            'promo_text' => 'nullable|string|max:100',
            'size_category' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $price = Price::create([
            'period' => strtoupper($request->period),
            'amount' => $request->amount,
            'promo_text' => $request->promo_text,
            'size_category' => $request->size_category,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tarifa creada con éxito',
            'price' => $price,
        ], 201);
    }

    /**
     * Update an existing price plan (Prototype Page 1 - "EDITAR").
     */
    public function update(Request $request, $id)
    {
        $price = Price::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'period' => 'sometimes|required|string|max:50',
            'amount' => 'sometimes|required|numeric|min:0',
            'promo_text' => 'nullable|string|max:100',
            'size_category' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->has('period')) {
            $price->period = strtoupper($request->period);
        }
        if ($request->has('amount')) {
            $price->amount = $request->amount;
        }
        if ($request->has('promo_text')) {
            $price->promo_text = $request->promo_text;
        }
        if ($request->has('size_category')) {
            $price->size_category = $request->size_category;
        }
        if ($request->has('is_active')) {
            $price->is_active = $request->is_active;
        }

        $price->save();

        return response()->json([
            'success' => true,
            'message' => 'Tarifa actualizada correctamente',
            'price' => $price,
        ]);
    }

    /**
     * Delete / deactivate a price plan.
     */
    public function destroy($id)
    {
        $price = Price::findOrFail($id);
        $price->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tarifa eliminada',
        ]);
    }
}
