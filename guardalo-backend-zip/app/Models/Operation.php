<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operation extends Model
{
    use HasFactory;

    protected $fillable = [
        'operation_code',
        'user_id',
        'box_id',
        'start_date',
        'end_date',
        'amount',
        'payment_status',
        'payment_method',
        'mercadopago_preference_id',
        'mercadopago_payment_id',
        'transfer_reference',
        'transfer_receipt_path',
        'card_last_four',
        'card_brand',
        'installments',
        'contract_pdf_path',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function box()
    {
        return $this->belongsTo(Box::class);
    }
}
