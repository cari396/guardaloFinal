<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Renovación - Guardalo.com</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3748; background-color: #f7fafc; padding: 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #edf2f7; }
        .header { background: #1E3264; color: #ffffff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px; }
        .header p { margin: 6px 0 0 0; font-size: 13px; color: #bee3f8; }
        .content { padding: 30px 24px; line-height: 1.6; }
        .badge { display: inline-block; background: #ebf8ff; color: #2b6cb0; padding: 6px 14px; border-radius: 9999px; font-weight: bold; font-size: 12px; margin-bottom: 18px; text-transform: uppercase; letter-spacing: 0.5px; }
        .badge-success { background: #c6f6d5; color: #22543d; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 20px 0; }
        .row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }
        .row:last-child { border-bottom: none; }
        .label { color: #718096; font-weight: 500; }
        .val { font-weight: bold; color: #1a202c; text-align: right; }
        .btn-container { text-align: center; margin: 28px 0 16px 0; }
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
            @if ($isClientCopy)
                <span class="badge badge-success">✓ Renovación de Alquiler Confirmada</span>
                <p style="font-size: 16px; margin-top: 0;">Estimado/a cliente,</p>
                <p>Te confirmamos que la renovación para tu unidad <strong>{{ $boxNumber }}</strong> fue registrada exitosamente.</p>
            @else
                <span class="badge" style="background:#feebc8; color:#c05621;">Notificación de Administración</span>
                <p style="font-size: 16px; margin-top: 0;">Se ha registrado una nueva renovación en el sistema para la unidad <strong>{{ $boxNumber }}</strong>.</p>
            @endif

            <div class="card">
                <div class="row">
                    <span class="label">Código de Operación:</span>
                    <span class="val">{{ $operationCode }}</span>
                </div>
                <div class="row">
                    <span class="label">Unidad (Box):</span>
                    <span class="val" style="color: #2b6cb0; font-size: 15px;">{{ $boxNumber }}</span>
                </div>
                <div class="row">
                    <span class="label">Tiempo Renovado:</span>
                    <span class="val">{{ $days }} días</span>
                </div>
                <div class="row">
                    <span class="label">Nuevo Vencimiento:</span>
                    <span class="val" style="color: #22543d; font-size: 15px;">{{ $newExpiresAt }}</span>
                </div>
                <div class="row">
                    <span class="label">Monto Abonado:</span>
                    <span class="val" style="color: #22543d;">${{ number_format((float)$price, 2, ',', '.') }}</span>
                </div>
                <div class="row">
                    <span class="label">Medio de Pago:</span>
                    <span class="val">{{ $payment ?: 'Mercado Pago' }}</span>
                </div>
            </div>

            @if (isset($contractUrl) && $contractUrl)
            <div class="btn-container">
                <a href="{{ $contractUrl }}" class="btn" target="_blank">VER MI CONTRATO Y COMPROBANTE OFICIAL</a>
            </div>
            @endif

            @if ($isClientCopy)
                <p style="text-align: center; font-size: 13px; color: #718096; margin-top: 20px;">
                    Podés consultar y gestionar tus unidades en cualquier momento desde <a href="{{ $panelUrl }}" style="color: #1E3264; font-weight: bold;">tu Panel de Clientes</a>.
                </p>
            @endif
        </div>
        <div class="footer">
            <p><strong>Guardalo.com</strong> — Av. Mitre 450, Chivilcoy, Provincia de Buenos Aires</p>
            <p>Por cualquier consulta escribinos a <a href="mailto:contacto@guardalo.com.ar" style="color: #2b6cb0;">contacto@guardalo.com.ar</a></p>
        </div>
    </div>
</body>
</html>
