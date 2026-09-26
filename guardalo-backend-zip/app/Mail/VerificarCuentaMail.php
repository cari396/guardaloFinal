<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class VerificarCuentaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $verificationUrl;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\User  $user
     * @param  string  $verificationUrl
     * @return void
     */
    public function __construct(User $user, string $verificationUrl)
    {
        $this->user = $user;
        $this->verificationUrl = $verificationUrl;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $fromEmail = config('mail.from.address', 'contacto@guardalo.com.ar');
        $fromName = config('mail.from.name', 'Guardalo.com');

        return $this->from($fromEmail, $fromName)
            ->subject('Activá tu cuenta en Guardalo.com')
            ->view('emails.verificar_cuenta');
    }
}
