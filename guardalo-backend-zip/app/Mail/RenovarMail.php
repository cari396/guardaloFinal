<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RenovarMail extends Mailable
{
    use Queueable, SerializesModels;

    public $boxNumber;
    public $email;
    public $days;
    public $price;
    public $payment;
    public $newExpiresAt;
    public $operationCode;
    public $isClientCopy;
    public $contractUrl;
    public $panelUrl;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($boxNumber, $email, $days, $price, $payment, $newExpiresAt, $operationCode, $isClientCopy = false)
    {
        $this->boxNumber = $boxNumber;
        $this->email = $email;
        $this->days = $days;
        $this->price = $price;
        $this->payment = $payment;
        $this->newExpiresAt = $newExpiresAt;
        $this->operationCode = $operationCode;
        $this->isClientCopy = $isClientCopy;
        $this->contractUrl = url('/contract/' . str_replace(['#', ' '], '', $operationCode));
        $this->panelUrl = rtrim(env('FRONTEND_URL', 'https://staging.guardalo.com.ar'), '/') . '/panel';
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

        if ($this->isClientCopy) {
            return $this->from($fromEmail, $fromName)
                ->subject('Confirmación de Renovación - ' . $this->boxNumber . ' (' . $this->operationCode . ')')
                ->view('emails.renovar');
        }

        return $this->from($fromEmail, $fromName)
            ->subject('Nueva Renovación registrada: ' . $this->boxNumber . ' - ' . $this->operationCode)
            ->replyTo($this->email ?: $fromEmail)
            ->view('emails.renovar');
    }
}
