<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Operation;
use App\Mail\VencimientoAlquilerMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class CheckRentalExpirations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'guardalo:check-expirations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verificar alquileres próximos a vencer y enviar recordatorios por email';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Iniciando verificación de vencimientos de alquileres...');

        $today = Carbon::today();

        // Get paid operations with an active box and user
        $operations = Operation::with(['user', 'box'])
            ->where('payment_status', 'pagado')
            ->whereNotNull('end_date')
            ->whereHas('box', function ($q) {
                $q->where('status', 'alquilado');
            })
            ->get();

        $notificationsSent = 0;

        foreach ($operations as $op) {
            if (!$op->user || !$op->user->email || !$op->box) {
                continue;
            }

            try {
                $endDate = Carbon::parse($op->end_date)->startOfDay();
            } catch (\Exception $e) {
                continue;
            }

            $diffInDays = $today->diffInDays($endDate, false);

            // Notify at 5 days, 3 days, 1 day, or day 0 (today)
            if (in_array($diffInDays, [5, 3, 1, 0])) {
                $clientName = $op->user->name ?: 'Cliente';
                $boxNumber = $op->box->box_number ?: 'BOX';
                $boxSize = $op->box->size ?: 'Mediano';
                $expirationDate = $endDate->format('d/m/Y');
                $renewUrl = config('app.frontend_url', 'https://staging.guardalo.com.ar') . '/renovar?box=' . urlencode($boxNumber);

                try {
                    Mail::to($op->user->email)->send(
                        new VencimientoAlquilerMail(
                            $clientName,
                            $boxNumber,
                            $boxSize,
                            $expirationDate,
                            (int)$diffInDays,
                            $renewUrl
                        )
                    );
                    $this->info("Recordatorio enviado a {$op->user->email} para la unidad {$boxNumber} (vence en {$diffInDays} días).");
                    $notificationsSent++;
                } catch (\Exception $e) {
                    $this->error("Error al enviar recordatorio a {$op->user->email}: " . $e->getMessage());
                }
            }
        }

        $this->info("Verificación finalizada. Se enviaron {$notificationsSent} recordatorios.");
        return 0;
    }
}
