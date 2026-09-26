<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VencimientoAlquilerMail extends Mailable
{
    use Queueable, SerializesModels;

    public $clientName;
    public $boxNumber;
    public $boxSize;
    public $expirationDate;
    public $daysRemaining;
    public $renewUrl;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($clientName, $boxNumber, $boxSize, $expirationDate, $daysRemaining, $renewUrl = null)
    {
        $this->clientName = $clientName;
        $this->boxNumber = $boxNumber;
        $this->boxSize = $boxSize;
        $this->expirationDate = $expirationDate;
        $this->daysRemaining = $daysRemaining;
        $this->renewUrl = $renewUrl ?: (config('app.frontend_url', 'https://staging.guardalo.com.ar') . '/renovar');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = $this->daysRemaining <= 1
            ? "⚠️ Tu alquiler en Guardalo vence " . ($this->daysRemaining === 0 ? "HOY" : "MAÑANA") . " ({$this->boxNumber})"
            : "Recordatorio: Tu alquiler en Guardalo vencerá en {$this->daysRemaining} días ({$this->boxNumber})";

        return $this->subject($subject)
                    ->view('emails.vencimiento_alquiler');
    }
}
