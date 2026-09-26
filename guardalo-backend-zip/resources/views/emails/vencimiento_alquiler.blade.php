<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aviso de Vencimiento de Alquiler - Guardalo.com</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3748; background-color: #f7fafc; margin: 0; padding: 20px; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #edf2f7; }
        .header { background: #1E3264; color: #ffffff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px; }
        .header p { margin: 6px 0 0 0; font-size: 13px; color: #bee3f8; }
        .content { padding: 30px 24px; line-height: 1.6; }
        .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-weight: bold; font-size: 12px; margin-bottom: 18px; text-transform: uppercase; letter-spacing: 0.5px; }
        .badge-warning { background: #fefcbf; color: #744210; }
        .badge-danger { background: #fed7d7; color: #9b2c2c; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 20px 0; }
        .row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }
        .row:last-child { border-bottom: none; }
        .label { color: #718096; font-weight: 500; }
        .val { font-weight: bold; color: #1a202c; text-align: right; }
        .btn-container { text-align: center; margin: 30px 0 20px 0; }
        .btn { display: inline-block; background-color: #1E3264; color: #ffffff !important; text-decoration: none; padding: 14px 32px; font-weight: bold; font-size: 14px; border-radius: 8px; letter-spacing: 0.5px; box-shadow: 0 4px 6px rgba(30, 50, 100, 0.2); }
        .footer { padding: 24px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #edf2f7; background: #fafafa; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>GUARDALO.COM</h1>
            <p>Almacenamiento Inteligente & Bauleras Seguras</p>
        </div>
        <div class="content">
            @if ($daysRemaining <= 1)
                <span class="badge badge-danger">⚠️ Atención Inmediata: Vencimiento Inminente</span>
            @else
                <span class="badge badge-warning">⏰ Aviso de Próximo Vencimiento</span>
            @endif

            <p style="font-size: 16px; margin-top: 0;">Hola <strong>{{ $clientName }}</strong>,</p>
            
            <p>Te escribimos para recordarte que el período de alquiler de tu unidad en <strong>Guardalo.com</strong> está próximo a vencer.</p>

            <div class="card">
                <div class="row">
                    <span class="label">Unidad Asignada:</span>
                    <span class="val" style="color: #2b6cb0; font-size: 15px;">{{ $boxNumber }}</span>
                </div>
                @if (isset($boxSize) && $boxSize)
                <div class="row">
                    <span class="label">Categoría / Tamaño:</span>
                    <span class="val">{{ $boxSize }}</span>
                </div>
                @endif
                <div class="row">
                    <span class="label">Fecha de Vencimiento:</span>
                    <span class="val" style="color: #e53e3e;">{{ $expirationDate }}</span>
                </div>
                <div class="row">
                    <span class="label">Tiempo Restante:</span>
                    <span class="val">
                        @if ($daysRemaining === 0)
                            <strong style="color: #e53e3e;">¡Vence Hoy!</strong>
                        @elseif ($daysRemaining === 1)
                            <strong style="color: #dd6b20;">Vence Mañana (1 día)</strong>
                        @else
                            {{ $daysRemaining }} días
                        @endif
                    </span>
                </div>
            </div>

            <p>Para asegurar la continuidad de tu espacio y mantener tus pertenencias resguardadas sin interrupciones, podés renovar tu período de forma 100% online en segundos a través de nuestro portal.</p>

            <div class="btn-container">
                <a href="{{ $renewUrl }}" class="btn" target="_blank">RENOVAR MI ALQUILER AHORA</a>
            </div>

            <p style="font-size: 13px; color: #718096; text-align: center; margin-top: 15px;">
                También podés ingresar a tu <a href="https://staging.guardalo.com.ar/panel" style="color: #1E3264; font-weight: bold;">Panel de Cliente</a> para ver todos tus boxes y contratos.
            </p>
        </div>
        <div class="footer">
            <p><strong>Guardalo.com</strong> &bull; Chivilcoy, Pcia. de Buenos Aires, Argentina</p>
            <p>Tel / WhatsApp: +54 9 2346 691234 &bull; Email: contacto@guardalo.com.ar</p>
        </div>
    </div>
</body>
</html>
