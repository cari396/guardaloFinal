<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Box extends Model
{
    use HasFactory;

    protected $fillable = [
        'box_number',
        'size',
        'dimensions',
        'status',
        'base_price',
        'notes',
    ];

    public function operations()
    {
        return $this->hasMany(Operation::class)->orderBy('created_at', 'desc');
    }

    public function currentOperation()
    {
        return $this->hasOne(Operation::class)
                    ->where('payment_status', 'pagado')
                    ->where('end_date', '>=', now()->toDateString())
                    ->latestOfMany();
    }
}
