-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-07-2026 a las 23:51:50
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `doc_editor`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `document`
--

CREATE TABLE `document` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `fileUrl` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `field`
--

CREATE TABLE `field` (
  `id` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `width` double NOT NULL,
  `height` double NOT NULL,
  `documentId` varchar(191) NOT NULL,
  `heightRatio` double DEFAULT NULL,
  `page` int(11) NOT NULL DEFAULT 1,
  `widthRatio` double DEFAULT NULL,
  `xRatio` double DEFAULT NULL,
  `yRatio` double DEFAULT NULL,
  `pageHeight` double DEFAULT NULL,
  `pageWidth` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `response`
--

CREATE TABLE `response` (
  `id` varchar(191) NOT NULL,
  `value` varchar(191) NOT NULL,
  `fieldId` varchar(191) NOT NULL,
  `roomId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `room`
--

CREATE TABLE `room` (
  `id` varchar(191) NOT NULL,
  `documentId` varchar(191) NOT NULL,
  `link` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('1a487f03-43eb-4460-8ffb-e8cb4a65650e', '516d9670ddaf732b2d9a933f77c360f5b5a0afc1e33dad4c2f3811295a339d7e', '2026-07-06 21:51:14.979', '20260703143016_room', NULL, NULL, '2026-07-06 21:51:14.972', 1),
('54711ebc-ab0c-48ca-a060-adff4437d4a1', 'a54503a5fb780789478618a671b08006cb44cf588a01e40c35fced18c3b573b8', '2026-07-06 21:51:14.970', '20260619171408_fix_response_relation', NULL, NULL, '2026-07-06 21:51:14.826', 1),
('a4ff191f-2ebf-4ea5-829b-c40181357283', 'cd017d40f41510683647105226244f0c394e9b99c757768ba504ae772ac63b73', '2026-07-06 21:51:15.390', '20260706215115_add_page_dimension', NULL, NULL, '2026-07-06 21:51:15.383', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `field`
--
ALTER TABLE `field`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Field_documentId_fkey` (`documentId`);

--
-- Indices de la tabla `response`
--
ALTER TABLE `response`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Response_fieldId_fkey` (`fieldId`),
  ADD KEY `Response_roomId_fkey` (`roomId`);

--
-- Indices de la tabla `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Room_link_key` (`link`),
  ADD KEY `Room_documentId_fkey` (`documentId`);

--
-- Indices de la tabla `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `field`
--
ALTER TABLE `field`
  ADD CONSTRAINT `Field_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `document` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `response`
--
ALTER TABLE `response`
  ADD CONSTRAINT `Response_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `field` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Response_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `Room_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `document` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
