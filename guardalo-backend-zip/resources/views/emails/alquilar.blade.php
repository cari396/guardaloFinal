<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Alquiler - Guardalo.com</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3748; background-color: #f7fafc; margin: 0; padding: 20px; -webkit-font-smoothing: antialiased; }
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
        .btn-container { text-align: center; margin: 30px 0 20px 0; }
        .btn { display: inline-block; background-color: #1E3264; color: #ffffff !important; text-decoration: none; padding: 14px 32px; font-weight: bold; font-size: 14px; border-radius: 8px; letter-spacing: 0.5px; box-shadow: 0 4px 6px rgba(30, 50, 100, 0.2); }
        .bank-card { background: #fffaf0; border: 1px solid #feebc8; border-radius: 10px; padding: 18px; margin: 20px 0; }
        .bank-card h4 { margin: 0 0 10px 0; color: #c05621; font-size: 14px; text-transform: uppercase; }
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
            @if ($copy)
                <span class="badge badge-success">✓ Solicitud de Alquiler Confirmada</span>
                <p style="font-size: 16px; margin-top: 0;">Hola <strong>{{ $name }} {{ $last_name }}</strong>,</p>
                <p>¡Gracias por confiar en <strong>Guardalo.com</strong>! Tu solicitud de alquiler ha sido registrada con éxito en nuestro sistema.</p>
            @else
                <span class="badge" style="background:#feebc8; color:#c05621;">Notificación de Administración</span>
                <p style="font-size: 16px; margin-top: 0;">Se ha registrado una nueva operación de alquiler en el sistema web.</p>
            @endif

            <div class="card">
                @if (isset($operationCode) && $operationCode)
                <div class="row">
                    <span class="label">Código de Operación:</span>
                    <span class="val">{{ $operationCode }}</span>
                </div>
                @endif
                @if (isset($boxNumber) && $boxNumber)
                <div class="row">
                    <span class="label">Unidad Asignada:</span>
                    <span class="val" style="color: #2b6cb0; font-size: 15px;">{{ $boxNumber }}</span>
                </div>
                @endif
                <div class="row">
                    <span class="label">Categoría / Tamaño:</span>
                    <span class="val">{{ $size }}</span>
                </div>
                <div class="row">
                    <span class="label">Período Contratado:</span>
                    <span class="val">{{ $start }} al {{ $end }} ({{ $time }} días)</span>
                </div>
                <div class="row">
                    <span class="label">Monto Total:</span>
                    <span class="val" style="color: #22543d; font-size: 16px;">${{ number_format((float)$price, 2, ',', '.') }}</span>
                </div>
                <div class="row">
                    <span class="label">Medio de Pago:</span>
                    <span class="val">{{ $payment }}</span>
                </div>
            </div>

            @if (isset($bankDetails) && $bankDetails)
            <div class="bank-card">
                <h4>Datos para Transferencia Bancaria</h4>
                <div style="font-size: 13px; line-height: 1.8; color: #7b341e;">
                    <div><strong>Banco:</strong> {{ $bankDetails['bank_name'] ?? 'Banco Santander Río' }}</div>
                    <div><strong>Titular:</strong> {{ $bankDetails['account_holder'] ?? 'Guardalo S.R.L.' }}</div>
                    <div><strong>CUIT:</strong> {{ $bankDetails['cuit'] ?? '30-71649281-9' }}</div>
                    <div><strong>CBU:</strong> <code style="background:#fff; padding:2px 6px; border-radius:4px; font-size:13px;">{{ $bankDetails['cbu'] ?? '0720218820000001234567' }}</code></div>
                    <div><strong>Alias:</strong> <code style="background:#fff; padding:2px 6px; border-radius:4px; font-weight:bold; color:#1E3264;">{{ $bankDetails['alias'] ?? 'GUARDALO.BOXES' }}</code></div>
                </div>
                <p style="font-size: 12px; color: #9c4221; margin: 12px 0 0 0;">
                    Por favor transferí el importe total y adjuntá el comprobante desde tu panel de cliente para activar tu unidad inmediatamente.
                </p>
            </div>
            @endif

            @if (isset($contractUrl) && $contractUrl)
            <div class="btn-container">
                <a href="{{ $contractUrl }}" class="btn" target="_blank">VER MI CONTRATO Y COMPROBANTE OFICIAL</a>
            </div>
            <p style="text-align: center; font-size: 12px; color: #718096; margin-top: 8px;">
                Podés descargar o imprimir tu contrato digital con validez legal en cualquier momento desde el botón superior o desde tu panel.
            </p>
            @endif

            <div style="background: #edf2f7; border-radius: 8px; padding: 14px; margin-top: 24px; font-size: 13px; color: #4a5568;">
                <strong>Instrucciones de Acceso:</strong> Nuestro predio en Chivilcoy cuenta con seguridad y cámaras las 24 horas. Para ingresar a tu box, podés presentarte en el predio con tu DNI.
            </div>
        </div>
        <div class="footer">
            <p><strong>Guardalo.com</strong> - Alquiler Inteligente de Bauleras</p>
            <p>Av. Mitre 450, Chivilcoy, Provincia de Buenos Aires</p>
            <p>Consultas y Asistencia: <a href="mailto:contacto@guardalo.com.ar" style="color: #2b6cb0;">contacto@guardalo.com.ar</a></p>
        </div>
    </div>
</body>
</html>
