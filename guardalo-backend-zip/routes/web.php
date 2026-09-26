<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Contacto;
use App\Http\Controllers\Alquilar;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });
//
// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::post('/contacto', Contacto::class);
Route::post('/alquilar', Alquilar::class);
Route::post('/renovar', [App\Http\Controllers\RenovarController::class, 'renovar']);
Route::get('/contract/{code}', [App\Http\Controllers\ContractController::class, 'show']);

// Payment routes accessible via root web URL as well
Route::get('/payments/bank-details', [\App\Http\Controllers\Api\PaymentController::class, 'getBankDetails']);
Route::post('/payments/create-preference', [\App\Http\Controllers\Api\PaymentController::class, 'createPreference']);
Route::post('/payments/process-card', [\App\Http\Controllers\Api\PaymentController::class, 'processCard']);
Route::post('/payments/confirm-transfer', [\App\Http\Controllers\Api\PaymentController::class, 'confirmTransfer']);
Route::match(['get', 'post'], '/mercadopago/webhook', [\App\Http\Controllers\Api\PaymentController::class, 'webhook']);
Route::match(['get', 'post'], '/api/payments/webhook', [\App\Http\Controllers\Api\PaymentController::class, 'webhook']);

// Serve comprobantes safely whether symlinked or not
Route::get('/storage/comprobantes/{filename}', function ($filename) {
    $path = storage_path('app/public/comprobantes/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});



require __DIR__.'/auth.php';
