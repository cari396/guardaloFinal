<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'version',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
