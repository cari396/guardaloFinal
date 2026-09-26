<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // 'admin' | 'cliente'
        'dni',
        'cuit',
        'phone',
        'cellphone',
        'address',
        'city',
        'verification_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Check if user is an administrator.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Operations/Rentals associated with this user.
     */
    public function operations()
    {
        return $this->hasMany(Operation::class)->orderBy('created_at', 'desc');
    }

    /**
     * Boxes currently rented by this user.
     */
    public function activeBoxes()
    {
        return $this->hasManyThrough(Box::class, Operation::class, 'user_id', 'id', 'id', 'box_id')
                    ->where('operations.payment_status', 'pagado')
                    ->where('operations.end_date', '>=', now()->toDateString());
    }
}
