<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Mail\VerificarCuentaMail;
use App\Mail\RecuperarPasswordMail;

class AuthController extends Controller
{
    /**
     * Register a new user with email verification.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'nullable|string',
            'dni' => 'nullable|string',
            'cuit' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo electrónico no es válido.',
            'email.unique' => 'Ya existe una cuenta registrada con este correo electrónico.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'password.confirmed' => 'Las contraseñas ingresadas no coinciden.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors()
            ], 422);
        }

        $verificationToken = Str::random(64);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'cliente',
            'phone' => $request->phone,
            'dni' => $request->dni,
            'cuit' => $request->cuit,
            'address' => $request->address,
            'city' => $request->city ?: 'Chivilcoy',
            'verification_token' => $verificationToken,
        ]);

        // Enviar correo de activación
        try {
            $frontendUrl = rtrim(env('FRONTEND_URL', 'https://staging.guardalo.com.ar'), '/');
            $verificationUrl = $frontendUrl . '/verificar-email?token=' . $verificationToken;
            Mail::to($user->email)->send(new VerificarCuentaMail($user, $verificationUrl));
        } catch (\Exception $e) {
            \Log::error('Error enviando correo de verificación: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'requires_verification' => true,
            'message' => '¡Cuenta creada con éxito! Te enviamos un enlace de activación a tu correo electrónico para que confirmes tu cuenta.',
            'email' => $user->email,
        ], 201);
    }

    /**
     * Login user and issue Sanctum token.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        // Validar si el email fue verificado
        if (!$user->email_verified_at) {
            return response()->json([
                'success' => false,
                'requires_verification' => true,
                'message' => 'Tu cuenta aún no fue activada. Por favor revisá tu correo o solicitá un nuevo enlace de activación.',
                'email' => $user->email,
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'dni' => $user->dni,
                'cuit' => $user->cuit,
                'address' => $user->address,
                'city' => $user->city,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Get current authenticated user profile.
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }

    /**
     * Update user personal data.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string',
            'dni' => 'nullable|string',
            'cuit' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($request->only([
            'name',
            'email',
            'phone',
            'cellphone',
            'dni',
            'cuit',
            'address',
            'city'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado exitosamente',
            'user' => $user,
        ]);
    }

    /**
     * Authenticate or register with Google OAuth / ID Token.
     */
    public function googleLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'credential' => 'nullable|string',
            'email'      => 'nullable|email',
            'name'       => 'nullable|string',
            'google_id'  => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Parámetros inválidos para autenticación con Google.',
                'errors'  => $validator->errors()
            ], 422);
        }

        $email = $request->email;
        $name = $request->name;

        // If JWT credential from Google Identity Services is provided, decode payload safely
        if ($request->filled('credential')) {
            $parts = explode('.', $request->credential);
            if (count($parts) >= 2) {
                $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
                if ($payload && isset($payload['email'])) {
                    $email = $payload['email'];
                    $name = $payload['name'] ?? ($payload['given_name'] ?? 'Usuario Google');
                }
            }
        }

        if (!$email) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo obtener el correo de la cuenta de Google.'
            ], 400);
        }

        $user = User::where('email', strtolower($email))->first();

        if (!$user) {
            $user = User::create([
                'name'     => $name ?: 'Usuario Google',
                'email'    => strtolower($email),
                'password' => Hash::make(\Illuminate\Support\Str::random(32)),
                'role'     => 'cliente',
                'city'     => 'Chivilcoy',
            ]);
        }

        $token = $user->createToken('google_auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Sesión iniciada con Google exitosamente.',
            'user'    => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'role'    => $user->role,
                'phone'   => $user->phone,
                'dni'     => $user->dni,
                'cuit'    => $user->cuit,
                'address' => $user->address,
                'city'    => $user->city,
            ],
            'token'   => $token,
        ]);
    }

    /**
     * Verify user email via token link.
     */
    public function verifyEmail(Request $request)
    {
        $token = $request->get('token') ?: $request->input('token');

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token de activación no proporcionado.',
            ], 400);
        }

        $user = User::where('verification_token', $token)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'El enlace de activación es inválido o ya ha sido utilizado.',
            ], 404);
        }

        $user->email_verified_at = now();
        $user->verification_token = null;
        $user->save();

        $authToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => '¡Tu cuenta ha sido activada con éxito!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'dni' => $user->dni,
                'cuit' => $user->cuit,
                'address' => $user->address,
                'city' => $user->city,
            ],
            'token' => $authToken,
        ]);
    }

    /**
     * Resend verification email.
     */
    public function resendVerification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email inválido.',
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No encontramos una cuenta con ese correo electrónico.',
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'success' => true,
                'already_verified' => true,
                'message' => 'Tu cuenta ya está verificada. Podés iniciar sesión normalmente.',
            ]);
        }

        $verificationToken = Str::random(64);
        $user->verification_token = $verificationToken;
        $user->save();

        try {
            $frontendUrl = rtrim(env('FRONTEND_URL', 'https://staging.guardalo.com.ar'), '/');
            $verificationUrl = $frontendUrl . '/verificar-email?token=' . $verificationToken;
            Mail::to($user->email)->send(new VerificarCuentaMail($user, $verificationUrl));
        } catch (\Exception $e) {
            \Log::error('Error reenviando verificación: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'No se pudo enviar el correo de activación. Por favor intente más tarde.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Te hemos reenviado el enlace de activación a tu correo electrónico.',
        ]);
    }

    /**
     * Send password reset email with token.
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ], [
            'email.required' => 'Ingresá tu correo electrónico.',
            'email.email' => 'El formato del correo electrónico no es válido.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $email = strtolower(trim($request->email));
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'success' => true,
                'message' => 'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.',
            ]);
        }

        $token = Str::random(64);

        // Delete old tokens and store new one
        DB::table('password_resets')->where('email', $email)->delete();
        DB::table('password_resets')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => now(),
        ]);

        try {
            $frontendUrl = rtrim(env('FRONTEND_URL', 'https://staging.guardalo.com.ar'), '/');
            $resetUrl = $frontendUrl . '/restablecer-password?token=' . $token . '&email=' . urlencode($email);
            Mail::to($user->email)->send(new RecuperarPasswordMail($user, $resetUrl));
        } catch (\Exception $e) {
            \Log::error('Error enviando email de recuperación: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'No se pudo enviar el correo de recuperación en este momento.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Te enviamos un enlace a tu correo electrónico para restablecer tu contraseña.',
        ]);
    }

    /**
     * Reset user password using token.
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'token.required' => 'El token de seguridad es requerido.',
            'email.required' => 'El correo electrónico es requerido.',
            'password.required' => 'Ingresá una nueva contraseña.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = strtolower(trim($request->email));
        $token = $request->token;

        $record = DB::table('password_resets')
            ->where('email', $email)
            ->where('token', $token)
            ->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'El enlace para restablecer la contraseña es inválido o ya fue utilizado.',
            ], 400);
        }

        // Token valid for 60 minutes
        if (\Carbon\Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_resets')->where('email', $email)->delete();
            return response()->json([
                'success' => false,
                'message' => 'El enlace ha expirado. Por favor solicitá un nuevo restablecimiento.',
            ], 400);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No encontramos un usuario con ese correo.',
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_resets')->where('email', $email)->delete();

        return response()->json([
            'success' => true,
            'message' => '¡Tu contraseña ha sido restablecida con éxito! Ya podés iniciar sesión.',
        ]);
    }

    /**
     * Logout and revoke token.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada exitosamente',
        ]);
    }
}
