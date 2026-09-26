-- ==============================================================================
-- GUARDALO.COM - BASE DE DATOS INICIAL PARA MYSQL (HOSTINGER)
-- ==============================================================================
-- Este archivo se puede importar directamente en phpMyAdmin de Hostinger.
-- Crea todas las tablas y siembra los 21 precios oficiales, boxes iniciales y el admin.

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- 1. TABLA: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cliente',
  `dni` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cuit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cellphone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABLA: password_resets
CREATE TABLE IF NOT EXISTS `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABLA: personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABLA: boxes
CREATE TABLE IF NOT EXISTS `boxes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `box_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dimensions` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'disponible',
  `base_price` decimal(10,2) DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `boxes_box_number_unique` (`box_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABLA: operations
CREATE TABLE IF NOT EXISTS `operations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `operation_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `box_id` bigint(20) unsigned NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mercadopago_preference_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mercadopago_payment_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transfer_reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transfer_receipt_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `card_last_four` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `card_brand` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `installments` int(11) DEFAULT 1,
  `contract_pdf_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `operations_operation_code_unique` (`operation_code`),
  KEY `operations_user_id_foreign` (`user_id`),
  KEY `operations_box_id_foreign` (`box_id`),
  CONSTRAINT `operations_box_id_foreign` FOREIGN KEY (`box_id`) REFERENCES `boxes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `operations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABLA: prices
CREATE TABLE IF NOT EXISTS `prices` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `period` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `promo_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size_category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TABLA: contract_templates
CREATE TABLE IF NOT EXISTS `contract_templates` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1.0',
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. TABLA: migrations (para que Laravel reconozca que las migraciones ya corrieron)
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- INSERCIÓN DE DATOS INICIALES
-- ==============================================================================

-- Migraciones registradas
INSERT INTO `migrations` (`migration`, `batch`) VALUES
('2014_10_12_000000_create_users_table', 1),
('2014_10_12_100000_create_password_resets_table', 1),
('2019_08_19_000000_create_failed_jobs_table', 1),
('2019_12_14_000001_create_personal_access_tokens_table', 1),
('2026_09_25_000001_add_fields_to_users_table', 1),
('2026_09_25_000002_create_boxes_table', 1),
('2026_09_25_000003_create_operations_table', 1),
('2026_09_25_000004_create_prices_table', 1),
('2026_09_25_000005_create_contract_templates_table', 1);

-- Usuario Administrador Inicial (password: password)
INSERT INTO `users` (`id`, `name`, `email`, `role`, `dni`, `cuit`, `phone`, `cellphone`, `address`, `city`, `password`, `created_at`, `updated_at`) VALUES
(1, 'Administrador Guardalo', 'admin@guardalo.com.ar', 'admin', '30.000.000', '20-30000000-9', '02346 15-55-1234', '02346 15-55-1234', 'Av. Mitre 450', 'Chivilcoy', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(2, 'Juan López', 'juan@guardalo.com.ar', 'admin', '32.456.789', '20-32456789-4', '02346 15-55-1234', '02346 15-55-1234', 'Av. Mitre 450', 'Chivilcoy', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW());

-- Inventario Inicial de Boxes
INSERT INTO `boxes` (`box_number`, `size`, `dimensions`, `status`, `base_price`, `created_at`, `updated_at`) VALUES
('BOX 01', 'Pequeño', '8.3m² (1.66x5m)', 'disponible', 3650.00, NOW(), NOW()),
('BOX 02', 'Pequeño', '8.3m² (1.66x5m)', 'disponible', 3650.00, NOW(), NOW()),
('BOX 03', 'Pequeño', '8.3m² (1.66x5m)', 'disponible', 3650.00, NOW(), NOW()),
('BOX 04', 'Pequeño', '8.3m² (1.66x5m)', 'disponible', 3650.00, NOW(), NOW()),
('BOX 05', 'Mediano', '13.75m² (2.75x5m)', 'disponible', 6000.00, NOW(), NOW()),
('BOX 06', 'Mediano', '13.75m² (2.75x5m)', 'disponible', 6000.00, NOW(), NOW()),
('BOX 07', 'Mediano', '13.75m² (2.75x5m)', 'disponible', 6000.00, NOW(), NOW()),
('BOX 08', 'Mediano', '13.75m² (2.75x5m)', 'disponible', 6000.00, NOW(), NOW()),
('BOX 09', 'Mediano', '13.75m² (2.75x5m)', 'disponible', 6000.00, NOW(), NOW()),
('BOX 10', 'Mediano', '13.75m² (2.75x5m)', 'disponible', 6000.00, NOW(), NOW()),
('BOX 11', 'Grande', '20.5m² (4.10x5m)', 'disponible', 9000.00, NOW(), NOW()),
('BOX 12', 'Grande', '20.5m² (4.10x5m)', 'disponible', 9000.00, NOW(), NOW()),
('BOX 13', 'Grande', '20.5m² (4.10x5m)', 'disponible', 9000.00, NOW(), NOW()),
('BOX 14', 'Grande', '20.5m² (4.10x5m)', 'disponible', 9000.00, NOW(), NOW()),
('BOX 15', 'Grande', '20.5m² (4.10x5m)', 'disponible', 9000.00, NOW(), NOW()),
('BOX 16', 'Mediano', '13.75m² (2.75x5m)', 'disponible', 6000.00, NOW(), NOW()),
('BOX 17', 'Pequeño', '8.3m² (1.66x5m)', 'disponible', 3650.00, NOW(), NOW()),
('BOX 18', 'Grande', '20.5m² (4.10x5m)', 'disponible', 9000.00, NOW(), NOW()),
('BOX 19', 'Mediano', '13.75m² (2.75x5m)', 'disponible', 6000.00, NOW(), NOW()),
('BOX 20', 'Grande', '20.5m² (4.10x5m)', 'disponible', 9000.00, NOW(), NOW());

-- Las 21 Tarifas Oficiales Homologadas
INSERT INTO `prices` (`period`, `amount`, `promo_text`, `size_category`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
-- Mediano (13.75m²)
('1 DÍA', 6000.00, NULL, 'Mediano (13.75m²)', 1, 1, NOW(), NOW()),
('3 DÍAS', 10000.00, NULL, 'Mediano (13.75m²)', 2, 1, NOW(), NOW()),
('7 DÍAS', 22500.00, NULL, 'Mediano (13.75m²)', 3, 1, NOW(), NOW()),
('15 DÍAS', 26250.00, NULL, 'Mediano (13.75m²)', 4, 1, NOW(), NOW()),
('30 DÍAS', 60000.00, NULL, 'Mediano (13.75m²)', 5, 1, NOW(), NOW()),
('90 DÍAS', 180000.00, 'promo +10 días', 'Mediano (13.75m²)', 6, 1, NOW(), NOW()),
('180 DÍAS', 360000.00, 'promo +30 días', 'Mediano (13.75m²)', 7, 1, NOW(), NOW()),

-- Pequeño (8.3m²)
('1 DÍA', 3650.00, NULL, 'Pequeño (8.3m²)', 11, 1, NOW(), NOW()),
('3 DÍAS', 6090.00, NULL, 'Pequeño (8.3m²)', 12, 1, NOW(), NOW()),
('7 DÍAS', 13700.00, NULL, 'Pequeño (8.3m²)', 13, 1, NOW(), NOW()),
('15 DÍAS', 22850.00, NULL, 'Pequeño (8.3m²)', 14, 1, NOW(), NOW()),
('30 DÍAS', 36500.00, NULL, 'Pequeño (8.3m²)', 15, 1, NOW(), NOW()),
('90 DÍAS', 109500.00, 'promo +10 días', 'Pequeño (8.3m²)', 16, 1, NOW(), NOW()),
('180 DÍAS', 219000.00, 'promo +30 días', 'Pequeño (8.3m²)', 17, 1, NOW(), NOW()),

-- Grande (20.5m²)
('1 DÍA', 9000.00, NULL, 'Grande (20.5m²)', 21, 1, NOW(), NOW()),
('3 DÍAS', 15000.00, NULL, 'Grande (20.5m²)', 22, 1, NOW(), NOW()),
('7 DÍAS', 33750.00, NULL, 'Grande (20.5m²)', 23, 1, NOW(), NOW()),
('15 DÍAS', 56250.00, NULL, 'Grande (20.5m²)', 24, 1, NOW(), NOW()),
('30 DÍAS', 90000.00, NULL, 'Grande (20.5m²)', 25, 1, NOW(), NOW()),
('90 DÍAS', 270000.00, 'promo +10 días', 'Grande (20.5m²)', 26, 1, NOW(), NOW()),
('180 DÍAS', 540000.00, 'promo +30 días', 'Grande (20.5m²)', 27, 1, NOW(), NOW());

-- Plantilla de Contrato
INSERT INTO `contract_templates` (`title`, `version`, `content`, `is_active`, `created_at`, `updated_at`) VALUES
('Contrato de Locación de Espacio de Almacenaje', '1.0', 'CONTRATO DE LOCACIÓN DE ESPACIO DE ALMACENAJE (BOX)\n\nEntre GUARDALO.COM (\"La Locadora\") y el CLIENTE (\"El Locatario\"):\nPRIMERA: El Locatario alquila el espacio individual determinado asignado para almacenamiento temporal de enseres y mercadería no peligrosa.\nSEGUNDA: El pago se efectuará por período anticipado. El vencimiento operará de pleno derecho al término del período contratado.\nTERCERA: Queda prohibido el almacenamiento de sustancias inflamables, tóxicas, ilegales o perecederas.', 1, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;
