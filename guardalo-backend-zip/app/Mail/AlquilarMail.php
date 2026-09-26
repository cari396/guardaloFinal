<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AlquilarMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $email;
    public $msg;
    public $last_name;
    public $dni;
    public $cellphone;
    public $phone;
    public $city;
    public $address;
    public $cuit;
    public $factura;
    public $tos;
    public $time;
    public $start;
    public $end;
    public $price;
    public $copy;
    public $payment;
    public $size;
    public $boxNumber;
    public $contractUrl;
    public $operationCode;
    public $bankDetails;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        $name, $email, $msg, $last_name, $dni, $cellphone, $phone,
        $city, $address, $cuit, $factura, $tos, $time, $start, $end,
        $price, $copy, $payment = 'No especificado', $size = 'Mediano',
        $boxNumber = null, $contractUrl = null, $operationCode = null, $bankDetails = null
    ) {
        $this->name = $name;
        $this->email = $email;
        $this->msg = $msg;
        $this->last_name = $last_name;
        $this->dni = $dni;
        $this->cellphone = $cellphone;
        $this->phone = $phone;
        $this->city = $city;
        $this->address = $address;
        $this->cuit = $cuit;
        $this->factura = $factura;
        $this->tos = $tos;
        $this->time = $time;
        $this->start = $start;
        $this->end = $end;
        $this->price = $price;
        $this->copy = $copy;
        $this->payment = $payment;
        $this->size = $size;
        $this->boxNumber = $boxNumber;
        $this->contractUrl = $contractUrl;
        $this->operationCode = $operationCode;
        $this->bankDetails = $bankDetails;
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

        if ($this->copy) {
            $unitStr = $this->boxNumber ? " ({$this->boxNumber})" : "";
            return $this->from($fromEmail, 'Guardalo.com - Alquiler de Box')
                ->subject('Confirmación de Alquiler de Box' . $unitStr . ' - Guardalo.com')
                ->view('emails.alquilar');
        }

        return $this->from($fromEmail, 'Guardalo.com - Solicitud Web')
            ->subject('Nueva solicitud de alquiler: ' . ($this->boxNumber ?: $this->size) . ' - ' . $this->name . ' ' . $this->last_name)
            ->replyTo($this->email ?: $fromEmail)
            ->view('emails.alquilar');
    }
}
