<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class RecuperarPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $resetUrl;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\User  $user
     * @param  string  $resetUrl
     * @return void
     */
    public function __construct(User $user, $resetUrl)
    {
        $this->user = $user;
        $this->resetUrl = $resetUrl;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $fromEmail = config('mail.from.address', 'no-responder@guardalo.com.ar');
        $fromName = config('mail.from.name', 'Guardalo.com');

        return $this->from($fromEmail, $fromName)
            ->replyTo('contacto@guardalo.com.ar', 'Guardalo.com')
            ->subject('Restablecer tu contraseña - Guardalo.com')
            ->view('emails.recuperar_password');
    }
}
