<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactoMail;
use Validator;
use Mail;

class Contacto extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required', 'email' => 'required|email', 'message' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $adminEmail = config('mail.from.address', 'contacto@guardalo.com.ar');
            Mail::to($adminEmail)
                ->send(new ContactoMail($request->get('name'), $request->get('email'), $request->get('message')));
        } catch (\Exception $e) {
            \Log::warning('No se pudo enviar email de contacto: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Mensaje enviado con éxito. Te responderemos a la brevedad.'
        ]);
    }
}
