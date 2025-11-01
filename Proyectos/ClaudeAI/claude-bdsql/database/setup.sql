-- Setup script para crear la base de datos BienesRaicesDB
-- Este script verifica si la base de datos existe y la crea si es necesario

-- Verificar y crear la base de datos
CREATE DATABASE IF NOT EXISTS BienesRaicesDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Seleccionar la base de datos
USE BienesRaicesDB;

-- Mensaje de confirmación
SELECT 'Base de datos BienesRaicesDB creada exitosamente' AS Status;
