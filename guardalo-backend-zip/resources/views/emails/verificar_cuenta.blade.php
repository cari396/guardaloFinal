<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activá tu cuenta - Guardalo.com</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3748; background-color: #f7fafc; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background: #1E3264; color: #ffffff; padding: 26px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px; }
        .content { padding: 32px 28px; line-height: 1.6; }
        .btn-container { text-align: center; margin: 30px 0 24px 0; }
        .btn { display: inline-block; background-color: #1E3264; color: #ffffff !important; text-decoration: none; padding: 14px 34px; font-weight: bold; font-size: 15px; border-radius: 6px; letter-spacing: 0.5px; }
        .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 18px; margin-top: 24px; font-size: 13px; color: #64748b; }
        .url-link { word-break: break-all; color: #2b6cb0; font-size: 12px; }
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
            <h2 style="color: #1E3264; margin-top: 0; font-size: 18px;">¡Bienvenido a Guardalo, {{ $user->name }}!</h2>
            <p>Gracias por registrarte en nuestra plataforma. Para completar tu registro y poder alquilar o renovar tus boxes de forma segura, por favor activá tu cuenta haciendo clic en el siguiente botón:</p>

            <div class="btn-container">
                <a href="{{ $verificationUrl }}" target="_blank" class="btn">ACTIVAR MI CUENTA</a>
            </div>

            <div class="info-box">
                <p style="margin: 0 0 8px 0;">Si el botón no funciona, copiá y pegá el siguiente enlace directamente en tu navegador:</p>
                <a href="{{ $verificationUrl }}" target="_blank" class="url-link">{{ $verificationUrl }}</a>
            </div>

            <p style="margin-top: 24px; font-size: 13px; color: #718096;">Si vos no solicitaste esta cuenta, podés ignorar este correo tranquilamente.</p>
        </div>
        <div class="footer">
            <p style="margin: 0;">Guardalo.com.ar · Chivilcoy, Pcia. de Buenos Aires</p>
            <p style="margin: 4px 0 0 0;">Tel / WhatsApp: +54 9 2346 68-7132 · contacto@guardalo.com.ar</p>
        </div>
    </div>
</body>
</html>
