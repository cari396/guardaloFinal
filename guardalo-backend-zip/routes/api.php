<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BoxController;
use App\Http\Controllers\Api\PriceController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Alquilar;
use App\Http\Controllers\RenovarController;
use App\Http\Controllers\ContractController;

/*
|--------------------------------------------------------------------------
| API Routes - Guardalo.com
|--------------------------------------------------------------------------
*/

// ==========================================
// 1. Rutas Públicas
// ==========================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'googleLogin']);
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/resend-verification', [AuthController::class, 'resendVerification']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Precios públicos (lectura de tarifas activas)
Route::get('/prices', [PriceController::class, 'index']);

// Disponibilidad pública de boxes
Route::get('/boxes/available', [BoxController::class, 'availableBoxes']);
Route::get('/boxes/availability', [BoxController::class, 'availability']);

// Contrato / Comprobante por código
Route::get('/contract/{code}', [ContractController::class, 'show']);

// Pasarela de Pagos (Mercado Pago, Tarjetas, Transferencias)
Route::get('/payments/bank-details', [PaymentController::class, 'getBankDetails']);
Route::get('/payments/installments', [PaymentController::class, 'getInstallments']);
Route::post('/payments/create-preference', [PaymentController::class, 'createPreference']);
Route::post('/payments/process-card', [PaymentController::class, 'processCard']);
Route::post('/payments/confirm-transfer', [PaymentController::class, 'confirmTransfer']);
Route::match(['get', 'post'], '/payments/webhook', [PaymentController::class, 'webhook']);

// ==========================================
// 2. Rutas Protegidas para Clientes (Requieren Token Sanctum)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    // Perfil de usuario y sesión
    Route::get('/user', [AuthController::class, 'me']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Alquiler y Renovación (Solo clientes autenticados)
    Route::post('/alquilar', Alquilar::class);
    Route::post('/renovar', [RenovarController::class, 'renovar']);

    // Portal de Clientes
    Route::get('/my-boxes', [BoxController::class, 'myBoxes']);
    Route::get('/my-operations', [BoxController::class, 'myOperations']);
    Route::get('/operations/{id}', [BoxController::class, 'operationDetail']);
});

// ==========================================
// 3. Rutas Protegidas de Administrador (Sanctum + Rol Admin)
// ==========================================
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Clientes
    Route::get('/admin/clients', [AdminController::class, 'clients']);

    // Inventario y Gestión de Boxes
    Route::get('/admin/boxes', [BoxController::class, 'adminIndex']);
    Route::post('/admin/boxes/set-capacity', [BoxController::class, 'setCapacity']);
    Route::post('/admin/boxes', [BoxController::class, 'store']);
    Route::put('/admin/boxes/{id}', [BoxController::class, 'update']);
    Route::delete('/admin/boxes/{id}', [BoxController::class, 'destroy']);

    // Plantilla de Contratos
    Route::get('/admin/contract-template', [AdminController::class, 'getContractTemplate']);
    Route::put('/admin/contract-template', [AdminController::class, 'updateContractTemplate']);

    // Modificación de Precios y Tarifas (Solo Admin)
    Route::post('/prices', [PriceController::class, 'store']);
    Route::put('/prices/{id}', [PriceController::class, 'update']);
    // Operaciones y Aprobación de Transferencias
    Route::get('/admin/operations', [AdminController::class, 'operations']);
    Route::put('/admin/operations/{id}/approve-transfer', [AdminController::class, 'approveTransfer']);
});
