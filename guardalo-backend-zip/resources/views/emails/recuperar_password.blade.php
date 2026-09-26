<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña - Guardalo.com</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d3748; background-color: #f7fafc; padding: 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #edf2f7; }
        .header { background: #1E3264; color: #ffffff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px; }
        .content { padding: 32px 26px; line-height: 1.6; }
        .btn-container { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; background-color: #1E3264; color: #ffffff !important; text-decoration: none; padding: 14px 34px; font-weight: bold; font-size: 14px; border-radius: 8px; letter-spacing: 0.5px; box-shadow: 0 4px 6px rgba(30, 50, 100, 0.2); }
        .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; color: #4a5568; }
        .footer { padding: 24px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #edf2f7; background: #fafafa; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>GUARDALO.COM</h1>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #bee3f8;">Almacenamiento Seguro & Bauleras</p>
        </div>
        <div class="content">
            <h2 style="color: #1E3264; font-size: 18px; margin-top: 0;">Restablecimiento de Contraseña</h2>
            <p>Hola <strong>{{ $user->name }}</strong>,</p>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Guardalo.com asociada a <strong>{{ $user->email }}</strong>.</p>
            <p>Para crear una nueva contraseña, hacé clic en el siguiente botón:</p>

            <div class="btn-container">
                <a href="{{ $resetUrl }}" class="btn" target="_blank">RESTABLECER MI CONTRASEÑA</a>
            </div>

            <div class="info-box">
                ⏱️ Este enlace es válido por <strong>60 minutos</strong>. Si vos no solicitaste este cambio, podés ignorar este correo; tu contraseña actual continuará siendo segura.
            </div>

            <p style="font-size: 12px; color: #718096; word-break: break-all;">
                Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br>
                <a href="{{ $resetUrl }}" style="color: #2b6cb0;">{{ $resetUrl }}</a>
            </p>
        </div>
        <div class="footer">
            <p><strong>Guardalo.com</strong> - Chivilcoy, Provincia de Buenos Aires</p>
            <p>Contacto de Seguridad: <a href="mailto:contacto@guardalo.com.ar" style="color: #2b6cb0;">contacto@guardalo.com.ar</a></p>
        </div>
    </div>
</body>
</html>
