<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Operation;

class PagoConfirmadoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $operation;
    public $boxNumber;
    public $clientName;
    public $amount;
    public $paymentMethod;
    public $contractUrl;
    public $isClientCopy;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\Operation  $operation
     * @param  bool  $isClientCopy
     * @return void
     */
    public function __construct(Operation $operation, $isClientCopy = true)
    {
        $this->operation = $operation;
        $this->boxNumber = $operation->box ? $operation->box->box_number : 'BOX';
        $this->clientName = $operation->user ? $operation->user->name : 'Cliente';
        $this->amount = $operation->amount;
        $this->paymentMethod = $operation->payment_method ?: 'Mercado Pago';
        $this->contractUrl = $operation->contract_pdf_path ?: url('/contract/' . str_replace(['#', ' '], '', $operation->operation_code));
        $this->isClientCopy = $isClientCopy;
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
                ->subject('¡Pago Confirmado! Tu unidad ' . $this->boxNumber . ' está activa - Guardalo.com')
                ->view('emails.pago_confirmado');
        }

        return $this->from($fromEmail, $fromName)
            ->subject('Pago Acreditado: ' . $this->boxNumber . ' (' . $this->operation->operation_code . ')')
            ->view('emails.pago_confirmado');
    }
}
