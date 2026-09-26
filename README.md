# Guardalo.com - Sistema Integral de Alquiler de Bauleras y Espacios de Guardado

Repositorio central con la solución integral de **Guardalo.com**:
* **Frontend:** Desarrollado con **Gatsby (React + TypeScript + Chakra UI)**.
* **Backend:** Desarrollado con **Laravel 8 (PHP + REST API + Sanctum + Mercado Pago SDK + SMTP)**.
* **Base de Datos:** Compatible con **MySQL (Hostinger)** y **PostgreSQL (Desarrollo local)**.

---

## 📁 Estructura del Repositorio

```text
├── guardalo-frontend/       # Aplicación Web Frontend (Gatsby / React)
│   ├── src/
│   │   ├── components/      # Componentes UI (AlquilarForm, WhatsAppButton, Header, etc.)
│   │   ├── context/         # AuthContext (Sesiones, Login, Registro, Tokens)
│   │   ├── pages/           # Rutas (/alquilar, /panel, /login, /renovar, etc.)
│   │   └── services/api.ts  # Cliente Axios y detector automático de entorno
│   └── package.json
│
├── guardalo-backend-zip/    # API Backend (Laravel 8)
│   ├── app/
│   │   ├── Console/Commands # Comandos Artisan (CheckRentalExpirations)
│   │   ├── Http/Controllers # Controladores (Auth, Box, Payment, Admin, Contract)
│   │   ├── Mail/            # Mailables (Alquilar, Renovar, PagoConfirmado, etc.)
│   │   └── Models/          # Modelos Eloquent (Box, Operation, User, Price)
│   ├── config/              # Configuraciones (mercadopago.php, mail.php, etc.)
│   ├── database/            # Migraciones y Seeders (PrototypeSeeder)
│   ├── resources/views/     # Vistas Blade (Contratos digitales y plantillas de correo)
│   └── routes/              # api.php y web.php
│
├── guardalo_staging.sql     # Script SQL con estructura de tablas y datos semilla
├── HOSTINGER_DEPLOY_GUIDE.md# Guía paso a paso para el despliegue en Hostinger
└── README.md
```

---

## ⚡ Características Principales Implementadas

1. **Catálogo y Reserva Online:**
   * Cálculo interactivo de tarifas según tamaño de box (Pequeño, Mediano, Grande) y duración (1 a 365 días).
   * Asignación automática de unidad disponible (`BOX 01`, `BOX 02`, etc.).

2. **Pasarela de Pagos & Transferencias:**
   * Integración con **Mercado Pago** (Checkout Pro y Sandbox).
   * Pago con **Tarjeta de Débito/Crédito** en 1 a 12 cuotas.
   * **Transferencia Bancaria:** El cliente sube su número de referencia y comprobante adjunto (JPG/PNG/PDF).
   * **Aprobación de Transferencias (Admin):** Visualización del comprobante en el panel y activación del box con 1 clic.

3. **Autenticación y Seguridad:**
   * Doble confirmación de contraseña en registro (`password_confirmation`) con botones para ver/ocultar clave.
   * Validación de correo electrónico al registrarse.
   * Recuperación de contraseña segura ("Olvidé mi contraseña") con token criptográfico vía email.
   * Roles: `cliente` y `admin`.

4. **Automatizaciones & Notificaciones:**
   * Generación y visualización de **Contrato Digital Oficial de Locación** (`/contract/{code}`).
   * Envío automático de correos corporativos vía SMTP con detalles del alquiler y contrato adjunto.
   * Recordatorio diario de vencimientos programado (`php artisan guardalo:check-expirations`) a los 5 días, 3 días, 1 día y día de vencimiento.
   * Botón flotante oficial de **WhatsApp** (`+54 9 2346 691234`) en todo el sitio.

5. **Panel de Administración:**
   * Gestión integral de inventario de boxes (altas, bajas, estado disponible/mantenimiento, ajuste de capacidad).
   * Actualización dinámica de tarifas y precios en tiempo real.
   * Lista de clientes registrados, teléfonos, DNI y boxes asociados.
   * Edición de términos legales de la plantilla de contrato.

---

## 🛠️ Ejecución en Entorno Local

### Backend (Laravel)
```bash
cd guardalo-backend-zip
composer install
php artisan serve --port=8080
```
*API local:* `http://localhost:8080`

### Frontend (Gatsby)
```bash
cd guardalo-frontend
npm install
npm run develop
```
*Web local:* `http://localhost:8000`

---

## 🌐 Credenciales Demo y Administración

* **Usuario Administrador:** `juan@guardalo.com.ar`
* **Contraseña:** `password`
