-- Guardalo Staging Database Dump (MySQL / MariaDB Compatible)
-- Compatible with Hostinger phpMyAdmin and MySQL 5.7+ / 8.0 / MariaDB 10.3+
SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
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
  `verification_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
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

DROP TABLE IF EXISTS `boxes`;
CREATE TABLE `boxes` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
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

DROP TABLE IF EXISTS `operations`;
CREATE TABLE `operations` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `operation_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `box_id` bigint(20) UNSIGNED NOT NULL,
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
  `card_brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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

DROP TABLE IF EXISTS `prices`;
CREATE TABLE `prices` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
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

DROP TABLE IF EXISTS `contract_templates`;
CREATE TABLE `contract_templates` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Contrato Estándar de Almacenaje',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1.0',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1, '2014_10_12_000000_create_users_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2, '2014_10_12_100000_create_password_resets_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3, '2019_08_19_000000_create_failed_jobs_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4, '2019_12_14_000001_create_personal_access_tokens_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (5, '2026_09_25_000001_add_fields_to_users_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (6, '2026_09_25_000002_create_boxes_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (7, '2026_09_25_000003_create_operations_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (8, '2026_09_25_000004_create_prices_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (9, '2026_09_25_000005_create_contract_templates_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (10, '2026_09_26_000001_add_payment_fields_to_operations_table', 1);

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`, `dni`, `cuit`, `phone`, `cellphone`, `address`, `city`) VALUES (1, 'Juan López', 'juan@guardalo.com.ar', '2026-09-25 19:37:49', '$2y$10$tu7u854eIp.74nWQegXbee46StPMYNPi1ObuxYUYlx1.3st3b.zii', NULL, '2026-09-25 19:37:49', '2026-09-25 19:37:49', 'admin', '32.456.789', NULL, '02346 15-55-1234', NULL, 'Av. Mitre 450, Chivilcoy', 'Chivilcoy');
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`, `dni`, `cuit`, `phone`, `cellphone`, `address`, `city`) VALUES (3, 'María González', 'maria.g@ejemplo.com', '2026-09-25 19:37:49', '$2y$10$QInoqDpW6pKoYwANj0GVhuWxx1x.fgTlUExB39DlMDIqZvhDYVVoe', NULL, '2026-09-25 19:37:49', '2026-09-25 19:37:49', 'cliente', '28.123.456', NULL, '02346 15-44-9988', NULL, 'Pellegrini 320, Chivilcoy', 'Chivilcoy');
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`, `dni`, `cuit`, `phone`, `cellphone`, `address`, `city`) VALUES (4, 'Carlos Perez', 'carlos@ejemplo.com', '2026-09-25 19:44:24', '$2y$10$UBELP2eaXi1cMpRAMAkQY.pVFDZnEziGCL.WwOejNwiEQu/ZekONC', NULL, '2026-09-25 19:44:24', '2026-09-25 19:44:24', 'cliente', '30111222', '20-30111222-7', NULL, '02346 15-11-2233', 'Av Soarez 123', 'Chivilcoy');
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`, `dni`, `cuit`, `phone`, `cellphone`, `address`, `city`) VALUES (5, 'Carlos Rossi', 'carlos.rossi@ejemplo.com', '2026-09-25 20:57:36', '$2y$10$SKpWlzMvuT9vytW8SVmWM.CFpS7JsHvBGPOIaeGhQPsZuw.E/c3t2', NULL, '2026-09-25 20:57:36', '2026-09-25 20:57:36', 'cliente', '38999888', NULL, '02346 15-44-3322', NULL, 'Av. Sarmiento 120', 'Chivilcoy');
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`, `dni`, `cuit`, `phone`, `cellphone`, `address`, `city`) VALUES (6, 'Carlos Tevez', 'test_dni_cuit_1118397292@ejemplo.com', '2026-09-25 21:16:48', '$2y$10$f/GPt/4YHKtJYUCMyXQdHOtY0ksa2EZe6QCUSrspVeJ5zkzXBQwP.', NULL, '2026-09-25 21:16:48', '2026-09-25 21:16:49', 'cliente', '30999888', '20-30999888-3', '011 4455-6677', NULL, NULL, 'Buenos Aires');
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`, `dni`, `cuit`, `phone`, `cellphone`, `address`, `city`) VALUES (7, 'Tomas Mazza', 'tomi@gmail.com', '2026-09-25 22:57:01', '$2y$10$xnMdUIDV7qwIwz8DrZyG4uZ44wvHwy24zFsZU6xHo7vaUTHjl3Z4q', NULL, '2026-09-25 22:57:01', '2026-09-25 22:57:49', 'cliente', '43186535', '20-43186547-6', '121212', '121212', 'asdasd', 'Chivilcoy');
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`, `dni`, `cuit`, `phone`, `cellphone`, `address`, `city`) VALUES (2, 'Juan López', 'juan.lopez@ejemplo.com', '2026-09-25 19:37:49', '$2y$10$MNw2pPRNqkxK2Utgf1m72eUBBNb/N06/9jS.yCBkXPb98V1P9w33e', NULL, '2026-09-25 19:37:49', '2026-09-26 13:49:06', 'cliente', '32456789', '20-32456789-4', '02346 15-55-1234', '02346 15-55-1234', 'Av. Mitre 450', 'Chivilcoy');

-- Dumping data for table `boxes`
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (1, 'BOX 16', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', '13500.00', NULL, '2026-09-25 19:37:49', '2026-09-25 19:37:49');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (2, 'BOX 17', 'Pequeño', '8.3m² (1.66x5m)', 'alquilado', '9800.00', NULL, '2026-09-25 19:37:49', '2026-09-25 19:37:49');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (4, 'BOX 04', 'Pequeño', '8.3m² (1.66x5m)', 'alquilado', '9800.00', NULL, '2026-09-25 19:37:49', '2026-09-25 19:37:49');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (3, 'BOX 18', 'Grande', '20.5m² (4.10x5m)', 'alquilado', '20500.00', NULL, '2026-09-25 19:37:49', '2026-09-25 19:44:24');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (5, 'BOX 05', 'Pequeño', '8.3m² (1.66x5m)', 'alquilado', '5200.00', NULL, '2026-09-25 20:45:48', '2026-09-25 23:15:16');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (6, 'BOX 06', 'Pequeño', '8.3m² (1.66x5m)', 'alquilado', '36500.00', NULL, '2026-09-25 22:57:49', '2026-09-25 23:15:16');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (7, 'BOX 07', 'Pequeño', '8.3m² (1.66x5m)', 'disponible', '36500.00', NULL, '2026-09-25 22:57:49', '2026-09-25 23:15:16');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (12, 'BOX 23', 'Grande', '20.5m² (4.10x5m)', 'disponible', NULL, 'Ajuste de capacidad', '2026-09-25 23:31:51', '2026-09-25 23:31:51');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (13, 'BOX 24', 'Grande', '20.5m² (4.10x5m)', 'disponible', NULL, 'Ajuste de capacidad', '2026-09-25 23:31:51', '2026-09-25 23:31:51');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (14, 'BOX 25', 'Grande', '20.5m² (4.10x5m)', 'disponible', NULL, 'Ajuste de capacidad', '2026-09-25 23:31:51', '2026-09-25 23:31:51');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (16, 'BOX 27', 'Grande', '20.5m² (4.10x5m)', 'disponible', NULL, 'Ajuste de capacidad', '2026-09-25 23:31:51', '2026-09-25 23:31:51');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (15, 'BOX 26', 'Grande', '20.5m² (4.10x5m)', 'disponible', NULL, 'Ajuste de capacidad', '2026-09-25 23:31:51', '2026-09-25 23:32:01');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (8, 'BOX 19', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', NULL, 'Ajuste de capacidad', '2026-09-25 23:20:23', '2026-09-26 13:49:06');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (9, 'BOX 20', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', NULL, 'Ajuste de capacidad', '2026-09-25 23:20:23', '2026-09-26 13:49:07');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (10, 'BOX 21', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', NULL, 'Ajuste de capacidad', '2026-09-25 23:20:23', '2026-09-26 13:52:06');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (11, 'BOX 22', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', NULL, 'Ajuste de capacidad', '2026-09-25 23:20:23', '2026-09-26 13:52:06');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (17, 'BOX 28', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', NULL, 'Ajuste de capacidad', '2026-09-26 13:53:08', '2026-09-26 13:53:32');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (18, 'BOX 29', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', NULL, 'Ajuste de capacidad', '2026-09-26 13:53:08', '2026-09-26 13:53:33');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (19, 'BOX 30', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', NULL, 'Ajuste de capacidad', '2026-09-26 13:53:08', '2026-09-26 13:53:33');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (20, 'BOX 31', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', NULL, 'Ajuste de capacidad', '2026-09-26 13:53:08', '2026-09-26 13:55:40');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (21, 'BOX 32', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', NULL, 'Ajuste de capacidad', '2026-09-26 13:53:08', '2026-09-26 13:55:40');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (25, 'BOX 36', 'Mediano', '13.75m² (2.75x5m)', 'disponible', NULL, 'Ajuste de capacidad', '2026-09-26 13:57:35', '2026-09-26 13:57:35');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (26, 'BOX 37', 'Mediano', '13.75m² (2.75x5m)', 'disponible', NULL, 'Ajuste de capacidad', '2026-09-26 13:57:35', '2026-09-26 13:57:35');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (27, 'BOX 38', 'Mediano', '13.75m² (2.75x5m)', 'disponible', NULL, 'Ajuste de capacidad', '2026-09-26 13:57:35', '2026-09-26 13:57:35');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (28, 'BOX 39', 'Mediano', '13.75m² (2.75x5m)', 'disponible', NULL, 'Ajuste de capacidad', '2026-09-26 13:57:35', '2026-09-26 13:57:35');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (29, 'BOX 40', 'Mediano', '13.75m² (2.75x5m)', 'disponible', NULL, 'Ajuste de capacidad', '2026-09-26 13:57:35', '2026-09-26 13:57:35');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (30, 'BOX 41', 'Mediano', '13.75m² (2.75x5m)', 'disponible', NULL, 'Ajuste de capacidad', '2026-09-26 13:57:35', '2026-09-26 13:57:35');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (31, 'BOX 42', 'Mediano', '13.75m² (2.75x5m)', 'disponible', NULL, 'Ajuste de capacidad', '2026-09-26 13:57:35', '2026-09-26 13:57:35');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (22, 'BOX 33', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', NULL, 'Ajuste de capacidad', '2026-09-26 13:57:35', '2026-09-26 13:57:35');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (23, 'BOX 34', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', NULL, 'Ajuste de capacidad', '2026-09-26 13:57:35', '2026-09-26 13:57:35');
INSERT INTO `boxes` (`id`, `box_number`, `size`, `dimensions`, `status`, `base_price`, `notes`, `created_at`, `updated_at`) VALUES (24, 'BOX 35', 'Mediano', '13.75m² (2.75x5m)', 'alquilado', NULL, 'Ajuste de capacidad', '2026-09-26 13:57:35', '2026-09-26 13:57:36');

-- Dumping data for table `prices`
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (2, '3 DÍAS', '10000.00', NULL, 'Mediano (13.75m²)', 1, 2, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (3, '7 DÍAS', '22500.00', NULL, 'Mediano (13.75m²)', 1, 3, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (4, '15 DÍAS', '26250.00', NULL, 'Mediano (13.75m²)', 1, 4, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (5, '30 DÍAS', '60000.00', NULL, 'Mediano (13.75m²)', 1, 5, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (6, '90 DÍAS', '180000.00', 'promo +10 días', 'Mediano (13.75m²)', 1, 6, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (7, '180 DÍAS', '360000.00', 'promo +30 días', 'Mediano (13.75m²)', 1, 7, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (9, '3 DÍAS', '6090.00', NULL, 'Pequeño (8.3m²)', 1, 12, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (10, '7 DÍAS', '13700.00', NULL, 'Pequeño (8.3m²)', 1, 13, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (11, '15 DÍAS', '22850.00', NULL, 'Pequeño (8.3m²)', 1, 14, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (12, '30 DÍAS', '36500.00', NULL, 'Pequeño (8.3m²)', 1, 15, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (13, '90 DÍAS', '109500.00', 'promo +10 días', 'Pequeño (8.3m²)', 1, 16, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (14, '180 DÍAS', '219000.00', 'promo +30 días', 'Pequeño (8.3m²)', 1, 17, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (15, '1 DÍA', '9000.00', NULL, 'Grande (20.5m²)', 1, 21, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (16, '3 DÍAS', '15000.00', NULL, 'Grande (20.5m²)', 1, 22, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (17, '7 DÍAS', '33750.00', NULL, 'Grande (20.5m²)', 1, 23, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (18, '15 DÍAS', '56250.00', NULL, 'Grande (20.5m²)', 1, 24, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (19, '30 DÍAS', '90000.00', NULL, 'Grande (20.5m²)', 1, 25, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (20, '90 DÍAS', '270000.00', 'promo +10 días', 'Grande (20.5m²)', 1, 26, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (21, '180 DÍAS', '540000.00', 'promo +30 días', 'Grande (20.5m²)', 1, 27, '2026-09-25 21:47:05', '2026-09-25 21:47:05');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (8, '1 DÍA', '3650.00', NULL, 'Pequeño (8.3m²)', 1, 11, '2026-09-25 21:47:05', '2026-09-25 23:35:10');
INSERT INTO `prices` (`id`, `period`, `amount`, `promo_text`, `size_category`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES (1, '1 DÍA', '6000.00', NULL, 'Mediano (13.75m²)', 1, 1, '2026-09-25 21:47:05', '2026-09-26 01:38:54');

-- Dumping data for table `contract_templates`
INSERT INTO `contract_templates` (`id`, `title`, `content`, `version`, `is_active`, `created_at`, `updated_at`) VALUES (1, 'Contrato de Locación de Espacio de Almacenaje', 'CONTRATO DE LOCACIÓN DE ESPACIO DE ALMACENAJE (BOX)\n\nEntre GUARDALO.COM (\"La Locadora\") y el CLIENTE (\"El Locatario\"):\nPRIMERA: El Locatario alquila el espacio individual determinado asignado para almacenamiento temporal de enseres y mercadería no peligrosa.\nSEGUNDA: El pago se efectuará por período anticipado. El vencimiento operará de pleno derecho al término del período contratado.\nTERCERA: Queda prohibido el almacenamiento de sustancias inflamables, tóxicas, ilegales o perecederas.', '1.0', 1, '2026-09-25 19:37:49', '2026-09-25 19:37:49');

-- Dumping data for table `operations`
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (1, '#OP-9482', 2, 1, '2026-09-22', '2026-12-22', '13500.00', 'pagado', 'mercadopago', NULL, 'Alquiler renovado con tarifa promocional trimestral', '2026-09-25 19:37:49', '2026-09-25 19:37:49', NULL, NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (2, '#OP-8921', 2, 2, '2026-09-22', '2026-12-22', '9800.00', 'pagado', 'transferencia', NULL, 'Alquiler de box individual', '2026-09-25 19:37:49', '2026-09-25 19:37:49', NULL, NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (3, '#OP-7301', 3, 4, '2026-09-01', '2026-11-01', '9800.00', 'pagado', 'mercadopago', NULL, NULL, '2026-09-25 19:37:49', '2026-09-25 19:37:49', NULL, NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (4, '#OP-7682', 4, 3, '2026-09-25', '2026-12-25', '13500.00', 'pagado', 'MercadoPago', NULL, 'Alquiler procesado vía web para Carlos Perez', '2026-09-25 19:44:24', '2026-09-25 19:44:24', NULL, NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (5, '#REN-7879', 2, 1, '2026-12-23', '2027-03-23', '13500.00', 'pagado', 'MercadoPago', NULL, 'Renovación de BOX 16 por 90 días', '2026-09-25 20:34:10', '2026-09-25 20:34:10', NULL, NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (6, '#REN-5685', 2, 1, '2027-03-24', '2027-06-22', '13500.00', 'pagado', 'MercadoPago', NULL, 'Renovación de BOX 16 por 90 días', '2026-09-25 20:45:35', '2026-09-25 20:45:35', NULL, NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (7, '#OP-7551', 2, 5, '2026-09-25', '2026-10-25', '5200.00', 'pagado', 'MercadoPago', NULL, 'Alquiler procesado vía web para Juan López', '2026-09-25 20:45:48', '2026-09-25 20:45:48', NULL, NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (8, '#OP-9384', 7, 6, '2026-09-25', '2026-10-24', '36500.00', 'pagado', 'Efectivo', NULL, 'Alquiler procesado vía web para Tomas Mazza', '2026-09-25 22:57:49', '2026-09-25 22:57:49', NULL, NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (24, '#REN-5182', 2, 22, '2026-10-27', '2027-01-25', '180000.00', 'pendiente_mercadopago', 'Mercado Pago', NULL, 'Renovación de BOX 33 por 90 días', '2026-09-26 13:57:36', '2026-09-26 13:57:36', 'MOCK-PREF-E11044DE0D', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (11, '#OP-8585', 2, 8, '2026-11-01', '2026-12-01', '60000.00', 'pendiente_mercadopago', 'Mercado Pago', 'http://localhost:8080/contract/OP-8585', 'Alquiler procesado vía web para Juan López | MP Pref: MOCK-PREF-562593CCEB', '2026-09-26 13:49:06', '2026-09-26 13:49:06', 'MOCK-PREF-562593CCEB', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (12, '#OP-1990', 2, 9, '2026-12-15', '2027-01-15', '60000.00', 'pendiente_transferencia', 'Transferencia Bancaria', 'http://localhost:8080/contract/OP-1990', 'Alquiler procesado vía web para Juan López | Ref Transferencia: TRANSF-8891234', '2026-09-26 13:49:07', '2026-09-26 13:49:07', NULL, NULL, 'TRANSF-8891234', NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (13, '#OP-9811', 2, 10, '2026-09-26', '2026-10-26', '60000.00', 'pagado', 'Tarjeta Visa (**** 1111) - 1 cuota(s)', 'http://localhost:8080/contract/OP-9811', 'Alquiler procesado vía web para Juan López | Pago Aprobado: AUTH-02DB9776 | Transacción: TXN-1790430726-8798', '2026-09-26 13:52:06', '2026-09-26 13:52:06', NULL, NULL, NULL, NULL, '1111', 'Visa', 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (19, '#OP-1261', 2, 21, '2026-11-01', '2026-12-01', '60000.00', 'pendiente_mercadopago', 'Mercado Pago', 'http://localhost:8080/contract/OP-1261', 'Alquiler procesado vía web para Juan López | MP Pref: MOCK-PREF-42A04F8EA4', '2026-09-26 13:55:40', '2026-09-26 13:55:40', 'MOCK-PREF-42A04F8EA4', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (14, '#OP-2696', 2, 11, '2026-11-01', '2026-12-01', '60000.00', 'pendiente_mercadopago', 'Mercado Pago', 'http://localhost:8080/contract/OP-2696', 'Alquiler procesado vía web para Juan López | MP Pref: MOCK-PREF-4A80B3B4DD', '2026-09-26 13:52:06', '2026-09-26 13:52:06', 'MOCK-PREF-4A80B3B4DD', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (15, '#OP-3404', 2, 17, '2026-09-26', '2026-10-26', '60000.00', 'pagado', 'Tarjeta Visa (**** 1111) - 1 cuota(s)', 'http://localhost:8080/contract/OP-3404', 'Alquiler procesado vía web para Juan López | Pago Aprobado: AUTH-9CAD0C3C | Transacción: TXN-1790430812-5133', '2026-09-26 13:53:32', '2026-09-26 13:53:32', NULL, NULL, NULL, NULL, '1111', 'Visa', 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (20, '#REN-7695', 2, 20, '2026-10-27', '2027-01-25', '180000.00', 'pendiente_mercadopago', 'Mercado Pago', NULL, 'Renovación de BOX 31 por 90 días', '2026-09-26 13:55:40', '2026-09-26 13:55:40', 'MOCK-PREF-1341622E18', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (16, '#OP-6514', 2, 18, '2026-11-01', '2026-12-01', '60000.00', 'pendiente_mercadopago', 'Mercado Pago', 'http://localhost:8080/contract/OP-6514', 'Alquiler procesado vía web para Juan López | MP Pref: MOCK-PREF-897C7E4700', '2026-09-26 13:53:33', '2026-09-26 13:53:33', 'MOCK-PREF-897C7E4700', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (17, '#OP-1462', 2, 19, '2026-12-15', '2027-01-15', '60000.00', 'pendiente_transferencia', 'Transferencia Bancaria', 'http://localhost:8080/contract/OP-1462', 'Alquiler procesado vía web para Juan López | Ref Transferencia: TRANSF-8891234', '2026-09-26 13:53:33', '2026-09-26 13:53:33', NULL, NULL, 'TRANSF-8891234', NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (18, '#OP-4487', 2, 20, '2026-09-26', '2026-10-26', '60000.00', 'pagado', 'Tarjeta Visa (**** 1111) - 1 cuota(s)', 'http://localhost:8080/contract/OP-4487', 'Alquiler procesado vía web para Juan López | Pago Aprobado: AUTH-FC63F981 | Transacción: TXN-1790430940-2519', '2026-09-26 13:55:40', '2026-09-26 13:55:40', NULL, NULL, NULL, NULL, '1111', 'Visa', 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (21, '#OP-2759', 2, 22, '2026-09-26', '2026-10-26', '60000.00', 'pagado', 'Tarjeta Visa (**** 1111) - 1 cuota(s)', 'http://localhost:8080/contract/OP-2759', 'Alquiler procesado vía web para Juan López | Pago Aprobado: AUTH-C67C8AB5 | Transacción: TXN-1790431055-3628', '2026-09-26 13:57:35', '2026-09-26 13:57:35', NULL, NULL, NULL, NULL, '1111', 'Visa', 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (25, '#REN-9179', 2, 1, '2027-06-23', '2027-06-30', '22500.00', 'pendiente_mercadopago', 'Mercado Pago', NULL, 'Renovación de BOX 16 por 7 días', '2026-09-26 14:42:04', '2026-09-26 14:42:04', 'MOCK-PREF-21A799F89B', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (22, '#OP-3926', 2, 23, '2026-11-01', '2026-12-01', '60000.00', 'pendiente_mercadopago', 'Mercado Pago', 'http://localhost:8080/contract/OP-3926', 'Alquiler procesado vía web para Juan López | MP Pref: MOCK-PREF-0A5518ADFD', '2026-09-26 13:57:35', '2026-09-26 13:57:35', 'MOCK-PREF-0A5518ADFD', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (23, '#OP-6510', 2, 24, '2026-12-15', '2027-01-15', '60000.00', 'pendiente_transferencia', 'Transferencia Bancaria', 'http://localhost:8080/contract/OP-6510', 'Alquiler procesado vía web para Juan López | Ref Transferencia: TRANSF-8891234', '2026-09-26 13:57:36', '2026-09-26 13:57:36', NULL, NULL, 'TRANSF-8891234', NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (27, '#REN-3496', 2, 1, '2027-06-23', '2027-06-26', '10000.00', 'pendiente_mercadopago', 'Mercado Pago', NULL, 'Renovación de BOX 16 por 3 días', '2026-09-26 14:42:37', '2026-09-26 14:42:37', 'MOCK-PREF-0A70A94CC1', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (28, '#REN-4618', 2, 1, '2027-06-23', '2027-06-30', '22500.00', 'pendiente_mercadopago', 'Mercado Pago', NULL, 'Renovación de BOX 16 por 7 días', '2026-09-26 14:42:38', '2026-09-26 14:42:38', 'MOCK-PREF-73C6C419D3', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (29, '#REN-8470', 2, 1, '2027-06-23', '2027-07-08', '26250.00', 'pendiente_mercadopago', 'Mercado Pago', NULL, 'Renovación de BOX 16 por 15 días', '2026-09-26 14:42:38', '2026-09-26 14:42:38', 'MOCK-PREF-0782551F13', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (30, '#REN-5371', 2, 1, '2027-06-23', '2027-07-23', '60000.00', 'pendiente_mercadopago', 'Mercado Pago', NULL, 'Renovación de BOX 16 por 30 días', '2026-09-26 14:42:38', '2026-09-26 14:42:38', 'MOCK-PREF-7823A34B48', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (31, '#REN-4376', 2, 1, '2027-06-23', '2027-09-21', '180000.00', 'pendiente_mercadopago', 'Mercado Pago', NULL, 'Renovación de BOX 16 por 90 días', '2026-09-26 14:42:38', '2026-09-26 14:42:38', 'MOCK-PREF-CAFDD78BA4', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (32, '#REN-8733', 2, 1, '2027-06-23', '2027-12-20', '360000.00', 'pendiente_mercadopago', 'Mercado Pago', NULL, 'Renovación de BOX 16 por 180 días', '2026-09-26 14:42:38', '2026-09-26 14:42:38', 'MOCK-PREF-E6EF70A7C2', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (33, '#REN-2861', 2, 1, '2027-06-23', '2028-06-22', '680000.00', 'pendiente_mercadopago', 'Mercado Pago', NULL, 'Renovación de BOX 16 por 365 días', '2026-09-26 14:42:39', '2026-09-26 14:42:39', 'MOCK-PREF-1D1D578E5A', NULL, NULL, NULL, NULL, NULL, 1);
INSERT INTO `operations` (`id`, `operation_code`, `user_id`, `box_id`, `start_date`, `end_date`, `amount`, `payment_status`, `payment_method`, `contract_pdf_path`, `notes`, `created_at`, `updated_at`, `mercadopago_preference_id`, `mercadopago_payment_id`, `transfer_reference`, `transfer_receipt_path`, `card_last_four`, `card_brand`, `installments`) VALUES (26, '#REN-4631', 2, 1, '2027-06-23', '2027-06-24', '6000.00', 'pagado', 'Tarjeta Visa (**** 0366) - 3 pago(s)', NULL, 'Renovación de BOX 16 por 1 días | Pago Aprobado: AUTH-4DCE5010 | Transacción: TXN-1790433802-7947 | Titular: JUAN PEREZ', '2026-09-26 14:42:37', '2026-09-26 14:43:22', 'MOCK-PREF-09A6B4847D', NULL, NULL, NULL, '0366', 'Visa', 3);

SET FOREIGN_KEY_CHECKS=1;

