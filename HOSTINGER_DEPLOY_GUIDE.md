# Guía Paso a Paso para Despliegue en Hostinger - Guardalo.com

Esta guía detalla los pasos exactos para publicar la plataforma en **Hostinger** utilizando tu servicio de hosting y las casillas de correo corporativo contratadas.

---

## Arquitectura de Producción

1. **Frontend (Sitio Web Gatsby):**
   - Se compila en archivos estáticos (`HTML`, `CSS`, `JS`).
   - Se sube directamente a la carpeta `public_html/` del dominio principal (`guardalo.com.ar`).
   - Carga ultrarrápida, sin consumo de memoria en el servidor y con certificado SSL gratuito (HTTPS).

2. **Backend (API Laravel):**
   - Se hospeda en un subdominio, por ejemplo: `api.guardalo.com.ar` (apuntando a la carpeta `/public` de Laravel).
   - Gestiona autenticación, clientes, operaciones, inventario de boxes y envío de emails.

3. **Base de Datos:**
   - **Hosting Compartido / Cloud (hPanel):** MySQL / MariaDB (creable en 1 clic en *Bases de Datos* de Hostinger).
   - **VPS:** PostgreSQL o MySQL instalados en el sistema operativo.

4. **Servicio de Correo (SMTP):**
   - Se utiliza el servidor SMTP de Hostinger para enviar notificaciones de alquileres, renovaciones y consultas de contacto.

---

## Paso 1: Configurar el Correo en Hostinger

1. Entrá a tu panel de **Hostinger (hPanel)** > sección **Emails** (o **Correo Electrónico**).
2. Asegurate de tener creada la cuenta de correo principal, por ejemplo:
   - `contacto@guardalo.com.ar` (o `info@guardalo.com.ar`).
3. Anotate la contraseña elegida para esa casilla.
4. Parámetros del servidor SMTP de Hostinger:
   - **Host SMTP:** `smtp.hostinger.com` *(o `smtp.titan.email` si utilizás Titan Mail)*.
   - **Puerto:** `465` con SSL (o `587` con TLS).
   - **Usuario:** `tu-correo@guardalo.com.ar`
   - **Contraseña:** la contraseña creada.

---

## Paso 2: Crear la Base de Datos en Hostinger

1. En **hPanel**, andá a **Bases de Datos** > **Bases de datos MySQL**.
2. Creá una nueva base de datos:
   - **Nombre de base de datos:** ej. `u123456789_guardalo`
   - **Usuario:** ej. `u123456789_user`
   - **Contraseña:** generá una contraseña segura y guardala.
3. El host local en Hostinger es siempre `127.0.0.1` o `localhost`.

---

## Paso 3: Configurar y Subir el Backend (Laravel)

1. En **hPanel** > **Dominios** > **Subdominios**:
   - Creá el subdominio: `api.guardalo.com.ar`.
   - Carpeta raíz del subdominio: apuntala a `public_html/api/public` (es fundamental que apunte a la carpeta `public` de Laravel).
2. Subí los archivos de la carpeta `guardalo-backend-zip` a esa ubicación mediante el **Administrador de Archivos** o por **FTP**.
3. Renombrá `.env.production.hostinger` a `.env` y completá:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://guardalo.com.ar

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=nombre_de_tu_base_creada
   DB_USERNAME=usuario_de_tu_base_creada
   DB_PASSWORD=password_de_tu_base_creada

   MAIL_MAILER=smtp
   MAIL_HOST=smtp.hostinger.com
   MAIL_PORT=465
   MAIL_USERNAME=contacto@guardalo.com.ar
   MAIL_PASSWORD=password_de_tu_mail
   MAIL_ENCRYPTION=ssl
   MAIL_FROM_ADDRESS=contacto@guardalo.com.ar
   MAIL_FROM_NAME="Guardalo.com"

   SANCTUM_STATEFUL_DOMAINS=guardalo.com.ar,www.guardalo.com.ar,api.guardalo.com.ar
   SESSION_DOMAIN=.guardalo.com.ar

   # Mercado Pago (obtené tus credenciales en https://www.mercadopago.com.ar/developers/panel)
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu_access_token_aqui
   MERCADOPAGO_PUBLIC_KEY=APP_USR-tu_public_key_aqui
   MERCADOPAGO_SANDBOX=false

   # Datos Bancarios para Transferencia Directa
   BANK_NAME="Banco Santander Río"
   BANK_ACCOUNT_HOLDER="Guardalo S.R.L."
   BANK_CUIT="30-71649281-9"
   BANK_CBU="0720218820000001234567"
   BANK_ALIAS="GUARDALO.BOXES"
   BANK_ACCOUNT_TYPE="Cuenta Corriente en Pesos"
   ```
4. Ejecutá las migraciones y seeders con los 21 precios oficiales y usuarios demo:
   - Desde la terminal SSH de Hostinger (o mediante un script PHP):
     ```bash
     php artisan migrate --force
     php artisan db:seed --force
     ```

---

## Paso 4: Compilar y Subir el Frontend (Gatsby)

1. En tu máquina local, abrí el archivo `.env.production` dentro de `guardalo-frontend/`:
   ```env
   GATSBY_ALQUILAR_ENDPOINT="https://api.guardalo.com.ar/alquilar"
   GATSBY_CONTACTO_ENDPOINT="https://api.guardalo.com.ar/contacto"
   GATSBY_API_URL="https://api.guardalo.com.ar"
   ```
2. Compilá el proyecto:
   ```bash
   npm run build
   ```
3. La carpeta `guardalo-frontend/public/` contendrá todo el sitio listo para producción.
4. Subí todo el contenido interno de esa carpeta `public/` directamente a la raíz de tu sitio en Hostinger (`public_html/`).

---

## Paso 5: Certificados SSL (HTTPS)

1. En **hPanel** > **Seguridad** > **SSL**:
   - Verificá que el certificado SSL gratuito de Let's Encrypt esté activo para:
     - `guardalo.com.ar`
     - `www.guardalo.com.ar`
     - `api.guardalo.com.ar`
   - Activá la opción **Forzar HTTPS**.

---

## Flujos Verificados y Listos

- **Registro y Login:** Autenticación con DNI y CUIT separados.
- **Alquileres:** Formulario con Stepper visual (3 pasos), 21 precios oficiales, cálculo dinámico de fechas, medios de pago y envío de confirmaciones por correo.
- **Renovación:** Extensión de boxes por 30, 90, 180 o 365 días, con cálculo automático de nueva fecha de vencimiento y notificación por correo.
- **Panel de Control:** Consulta de operaciones para clientes y vista de clientes registrados en tiempo real para administradores.
