<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pago - Guardalo.com</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3748; background-color: #f7fafc; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background: #1E3264; color: #ffffff; padding: 26px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px; }
        .content { padding: 28px; line-height: 1.6; }
        .success-badge { display: inline-block; background: #c6f6d5; color: #22543d; padding: 6px 14px; border-radius: 9999px; font-weight: bold; font-size: 13px; margin-bottom: 16px; }
        .card { background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 18px 0; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }
        .row:last-child { border-bottom: none; }
        .label { color: #718096; font-weight: 500; }
        .val { font-weight: bold; color: #1a202c; text-align: right; }
        .btn-container { text-align: center; margin: 26px 0 16px 0; }
        .btn { display: inline-block; background-color: #1E3264; color: #ffffff !important; text-decoration: none; padding: 12px 28px; font-weight: bold; font-size: 14px; border-radius: 6px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>GUARDALO.COM</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #bee3f8;">Almacenamiento Seguro & Bauleras</p>
        </div>
        <div class="content">
            @if ($isClientCopy)
                <span class="success-badge">✓ PAGO ACREDITADO CON ÉXITO</span>
                <p>Hola <strong>{{ $clientName }}</strong>,</p>
                <p>Te confirmamos que hemos recibido y acreditado correctamente tu pago. Tu espacio ya se encuentra reservado y activo en nuestro sistema.</p>
            @else
                <span class="success-badge" style="background:#feebc8; color:#c05621;">Notificación de Administración</span>
                <p>Se ha registrado un pago acreditado para la operación <strong>{{ $operation->operation_code }}</strong>.</p>
            @endif

            <div class="card">
                <div class="row">
                    <span class="label">Código de Operación:</span>
                    <span class="val">{{ $operation->operation_code }}</span>
                </div>
                <div class="row">
                    <span class="label">Unidad Asignada:</span>
                    <span class="val" style="color: #2b6cb0;">{{ $boxNumber }}</span>
                </div>
                <div class="row">
                    <span class="label">Período de Alquiler:</span>
                    <span class="val">{{ \Carbon\Carbon::parse($operation->start_date)->format('d/m/Y') }} al {{ \Carbon\Carbon::parse($operation->end_date)->format('d/m/Y') }}</span>
                </div>
                <div class="row">
                    <span class="label">Monto Acreditado:</span>
                    <span class="val" style="color: #22543d; font-size: 15px;">${{ number_format($amount, 2, ',', '.') }}</span>
                </div>
                <div class="row">
                    <span class="label">Medio de Pago:</span>
                    <span class="val">{{ $paymentMethod }}</span>
                </div>
                <div class="row">
                    <span class="label">Estado del Box:</span>
                    <span class="val" style="color: #22543d;">Activo / Alquilado</span>
                </div>
            </div>

            @if ($contractUrl)
            <div class="btn-container">
                <a href="{{ $contractUrl }}" class="btn" target="_blank">VER MI CONTRATO Y COMPROBANTE</a>
            </div>
            @endif

            <p style="font-size: 13px; color: #718096; margin-top: 20px;">
                <strong>Instrucciones de Ingreso:</strong> Podés acceder a tu box en los horarios habituales de atención en nuestro predio en Chivilcoy con tu DNI.
            </p>
        </div>
        <div class="footer">
            <p>Guardalo.com - Av. Mitre 450, Chivilcoy, Pcia. de Buenos Aires</p>
            <p>Por consultas, escribinos a <a href="mailto:contacto@guardalo.com.ar" style="color: #2b6cb0;">contacto@guardalo.com.ar</a></p>
        </div>
    </div>
</body>
</html>
