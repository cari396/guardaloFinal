<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Operation;
use App\Models\ContractTemplate;

class ContractController extends Controller
{
    /**
     * Show or download the contract for a given operation.
     *
     * @param string $code
     * @return \Illuminate\View\View
     */
    public function show($code)
    {
        $cleanCode = str_replace(['#', ' '], '', $code);

        $operation = Operation::with(['user', 'box'])
            ->where('operation_code', 'LIKE', '%' . $cleanCode . '%')
            ->orWhere('id', is_numeric($cleanCode) ? (int)$cleanCode : 0)
            ->first();

        if (!$operation) {
            abort(404, 'Operación de alquiler o contrato no encontrado.');
        }

        $template = ContractTemplate::where('is_active', true)->first();

        return view('contracts.show', [
            'operation' => $operation,
            'template' => $template,
        ]);
    }
}
