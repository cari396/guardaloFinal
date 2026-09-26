<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrato de Locación - {{ $operation->operation_code }} - Guardalo.com</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f1f5f9;
            color: #1e293b;
            font-size: 13px;
            line-height: 1.5;
            padding: 24px;
        }

        .action-bar {
            max-width: 820px;
            margin: 0 auto 20px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #ffffff;
            padding: 14px 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
        }

        .action-bar .brand-badge {
            font-weight: 700;
            color: #16284a;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 15px;
        }

        .action-bar .buttons {
            display: flex;
            gap: 10px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s;
            border: none;
        }

        .btn-primary {
            background-color: #16284a;
            color: #ffffff;
        }
        .btn-primary:hover {
            background-color: #0f1d38;
        }

        .btn-outline {
            background-color: transparent;
            color: #475569;
            border: 1px solid #cbd5e1;
        }
        .btn-outline:hover {
            background-color: #f8fafc;
        }

        .contract-page {
            max-width: 820px;
            margin: 0 auto;
            background: #ffffff;
            padding: 40px 48px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #16284a;
            padding-bottom: 20px;
            margin-bottom: 24px;
        }

        .logo-title h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 26px;
            color: #16284a;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .logo-title p {
            color: #64748b;
            font-size: 12px;
            font-weight: 500;
            margin-top: 2px;
        }

        .contract-meta {
            text-align: right;
        }

        .contract-meta .code-badge {
            display: inline-block;
            background: #eff6ff;
            color: #1d4ed8;
            font-weight: 700;
            font-size: 14px;
            padding: 4px 10px;
            border-radius: 4px;
            border: 1px solid #bfdbfe;
            margin-bottom: 4px;
        }

        .contract-meta p {
            font-size: 11px;
            color: #64748b;
        }

        .contract-title {
            text-align: center;
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #0f172a;
            background: #f8fafc;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            margin-bottom: 24px;
        }

        .section-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #16284a;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-top: 20px;
            margin-bottom: 12px;
        }

        .grid-two {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }

        .info-card {
            background: #fafaf9;
            border: 1px solid #e7e5e4;
            border-radius: 6px;
            padding: 12px 16px;
        }

        .info-card h4 {
            font-size: 11px;
            text-transform: uppercase;
            color: #78716c;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            font-size: 12px;
        }

        .info-row .label {
            color: #64748b;
            font-weight: 500;
        }

        .info-row .value {
            font-weight: 600;
            color: #1e293b;
            text-align: right;
        }

        .clauses {
            font-size: 11.5px;
            line-height: 1.6;
            color: #334155;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 16px 20px;
            margin-top: 12px;
            margin-bottom: 24px;
            white-space: pre-line;
        }

        .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 36px;
            padding-top: 20px;
            border-top: 1px dashed #cbd5e1;
        }

        .sign-box {
            text-align: center;
        }

        .sign-line {
            height: 48px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            border-bottom: 1px solid #475569;
            margin-bottom: 8px;
            font-size: 11px;
            color: #2563eb;
            font-style: italic;
        }

        .sign-box h5 {
            font-size: 12px;
            font-weight: 700;
            color: #0f172a;
        }

        .sign-box p {
            font-size: 11px;
            color: #64748b;
        }

        .footer-note {
            text-align: center;
            margin-top: 32px;
            padding-top: 12px;
            border-top: 1px solid #f1f5f9;
            font-size: 10.5px;
            color: #94a3b8;
        }

        @media print {
            body {
                background: #ffffff;
                padding: 0;
            }
            .action-bar {
                display: none !important;
            }
            .contract-page {
                box-shadow: none;
                border: none;
                padding: 0;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>

    <!-- Action Bar for viewing / printing / downloading -->
    <div class="action-bar">
        <div class="brand-badge">
            <span>🛡️</span> GUARDALO.COM · Contrato Oficial
        </div>
        <div class="buttons">
            <button class="btn btn-primary" onclick="window.print()">
                🖨️ Imprimir / Guardar en PDF
            </button>
            <a href="{{ url('/') }}" class="btn btn-outline">
                Volver a la web
            </a>
        </div>
    </div>

    <!-- Contract Sheet -->
    <div class="contract-page">
        <div class="header">
            <div class="logo-title">
                <h1>GUARDALO.COM</h1>
                <p>Alquiler de Espacios de Guardado Inteligente · Chivilcoy</p>
                <p>Ruta Nacional 5 Km 158.5 · contacto@guardalo.com.ar</p>
            </div>
            <div class="contract-meta">
                <div class="code-badge">{{ $operation->operation_code }}</div>
                <p><strong>Fecha de emisión:</strong> {{ \Carbon\Carbon::parse($operation->created_at)->format('d/m/Y H:i') }} hs</p>
                <p><strong>Estado:</strong> APROBADO / ACTIVO</p>
            </div>
        </div>

        <div class="contract-title">
            CONTRATO DE LOCACIÓN DE ESPACIO DE ALMACENAJE (BOX)
        </div>

        <div class="grid-two">
            <!-- Locatario (Cliente) -->
            <div class="info-card">
                <h4>Datos del Locatario (Cliente)</h4>
                <div class="info-row">
                    <span class="label">Nombre y Apellido:</span>
                    <span class="value">{{ $operation->user->name }}</span>
                </div>
                <div class="info-row">
                    <span class="label">DNI:</span>
                    <span class="value">{{ $operation->user->dni ?: 'S/D' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">CUIT / CUIL:</span>
                    <span class="value">{{ $operation->user->cuit ?: 'S/C' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Domicilio:</span>
                    <span class="value">{{ $operation->user->address ?: 'Chivilcoy' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Localidad:</span>
                    <span class="value">{{ $operation->user->city ?: 'Chivilcoy' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">{{ $operation->user->email }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Teléfono:</span>
                    <span class="value">{{ $operation->user->cellphone ?: $operation->user->phone ?: 'S/T' }}</span>
                </div>
            </div>

            <!-- Detalles del Box y Alquiler -->
            <div class="info-card">
                <h4>Detalles de la Unidad y Período</h4>
                <div class="info-row">
                    <span class="label">Unidad Asignada:</span>
                    <span class="value" style="color: #1d4ed8;">{{ $operation->box ? $operation->box->box_number : 'BOX ASIGNADO' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Tamaño / Categoría:</span>
                    <span class="value">{{ $operation->box ? $operation->box->size : 'Estándar' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Dimensiones:</span>
                    <span class="value">{{ $operation->box ? $operation->box->dimensions : '-' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Fecha de Ingreso:</span>
                    <span class="value">{{ \Carbon\Carbon::parse($operation->start_date)->format('d/m/Y') }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Fecha de Vencimiento:</span>
                    <span class="value">{{ \Carbon\Carbon::parse($operation->end_date)->format('d/m/Y') }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Monto Contratado:</span>
                    <span class="value" style="color: #047857;">$ {{ number_format($operation->amount, 2, ',', '.') }} + IVA</span>
                </div>
                <div class="info-row">
                    <span class="label">Medio de Pago:</span>
                    <span class="value">{{ $operation->payment_method ?: 'Tarjeta / Transferencia' }}</span>
                </div>
            </div>
        </div>

        <div class="section-title">Cláusulas y Condiciones del Servicio</div>
        <div class="clauses">
@if(isset($template) && $template->content)
{{ $template->content }}
@else
PRIMERA (OBJETO): GUARDALO.COM concede en locación al Locatario individualizado precedentemente el uso del espacio privado e individual (BOX) destinado exclusivamente al almacenaje y custodia transitoria de muebles, mercaderías, bienes muebles y enseres de su legítima propiedad.

SEGUNDA (CANON Y PAGO): El canon locativo ha sido convenido y abonado por adelantado por el período pactado. El vencimiento del plazo operará de pleno derecho al término del período contratado, pudiendo el Locatario solicitar su renovación con antelación fehaciente.

TERCERA (DESTINO Y PROHIBICIONES): Queda terminantemente prohibido el depósito de sustancias peligrosas, corrosivas, explosivas, inflamables, tóxicas, perecederas, animales vivos o mercadería de procedencia ilegítima o prohibida por la legislación vigente.

CUARTA (ACCESO Y SEGURIDAD): El Locatario accederá a las instalaciones mediante los mecanismos de identificación y horarios habilitados por la administración. GUARDALO.COM garantiza la custodia perimetral, monitoreo permanente y condiciones adecuadas de cerramiento.

QUINTA (CONFORMIDAD): Las partes declaran aceptar las presentes condiciones, fijando domicilios especiales en los consignados en el encabezado.
@endif
        </div>

        <div class="signatures">
            <div class="sign-box">
                <div class="sign-line">
                    ✓ Firma y Sello Digital Autorizado
                </div>
                <h5>GUARDALO.COM</h5>
                <p>Administración Central · La Locadora</p>
            </div>
            <div class="sign-box">
                <div class="sign-line">
                    ✓ Aceptado Electrónicamente (IP y Hash Registrado)
                </div>
                <h5>{{ $operation->user->name }}</h5>
                <p>DNI {{ $operation->user->dni ?: 'Verificado' }} · El Locatario</p>
            </div>
        </div>

        <div class="footer-note">
            Documento de validez legal emitido conforme a la legislación civil y comercial de la República Argentina.<br>
            Guardalo.com © {{ date('Y') }} · Sistema de Gestión de Depósitos.
        </div>
    </div>

    @if(request()->get('print') == 1)
    <script>
        window.addEventListener('load', function() {
            setTimeout(function() {
                window.print();
            }, 600);
        });
    </script>
    @endif
</body>
</html>
