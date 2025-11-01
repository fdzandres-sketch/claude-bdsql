-- Script de datos de ejemplo (seed) para BienesRaicesDB
-- Datos actualizados para coincidir con el esquema actual

USE BienesRaicesDB;

-- ============================================
-- 1. ZONAS - 5 diferentes ciudades de Mexico
-- ============================================
INSERT INTO zonas (estado, edo_codigo, municipio, cp, zona, ciudad, latitud, longitud, tipo_zona, calif_zona, nivel_socioeconomico, indice_seguridad, plusvalia_anual) VALUES
('CDMX', '09', 'Miguel Hidalgo', '11560', 'Polanco', 'Ciudad de Mexico', 19.4326, -99.1332, 'residencial', 'A+', 'alto', 9.5, 5.2),
('Estado de Mexico', '15', 'Atizapan de Zaragoza', '52930', 'Zona Esmeralda', 'Atizapan de Zaragoza', 19.5558, -99.2692, 'residencial', 'A', 'alto', 8.5, 4.8),
('Nuevo Leon', '19', 'Monterrey', '66269', 'Valle Oriente', 'Monterrey', 25.6487, -100.3673, 'residencial', 'A+', 'alto', 9.0, 6.0),
('Jalisco', '14', 'Zapopan', '45100', 'Zapopan Centro', 'Zapopan', 20.7214, -103.3918, 'mixto', 'A', 'medio-alto', 8.0, 4.5),
('Puebla', '21', 'Puebla', '72810', 'Angelopolis', 'Puebla', 19.0135, -98.2631, 'residencial', 'A', 'alto', 8.5, 5.0);

-- ============================================
-- 2. EMPRESAS INMOBILIARIAS
-- ============================================
INSERT INTO empresas (nombre_sociedad, marca_inmobiliaria, giro, calle, no_exterior, id_zona) VALUES
('Inmobiliaria Premium Mexico S.A. de C.V.', 'Premium MX', 'Inmobiliaria', 'Av. Insurgentes Sur', '1234', 1),
('Propiedades del Norte S.A.', 'PropNorte', 'Inmobiliaria', 'Av. Constitucion', '567', 3);

-- ============================================
-- 3. PERSONAS (BROKERS)
-- ============================================
INSERT INTO personas (nombre, apellido_paterno, mobil, email, clasif_persona, id_empresa_vinc) VALUES
('Carlos', 'Martinez', '5551-2345', 'carlos.martinez@premiummx.com', 'Broker', 1),
('Ana', 'Garcia', '8182-3456', 'ana.garcia@propnorte.com', 'Broker', 2),
('Luis', 'Hernandez', '5552-4567', 'luis.hernandez@premiummx.com', 'Broker', 1);

-- ============================================
-- 4. INMUEBLES - Propiedades variadas
-- ============================================

-- Casa en Polanco
INSERT INTO inmuebles (
    tipo_operacion, tipo_inmueble, caracterizacion, vocacion,
    id_zona, calle, no_exterior,
    titulo, descripcion,
    medida_terreno, medida_construccion,
    importe_venta, moneda_venta,
    recamaras, banos, medios_banos, estacionamientos,
    ano_construccion,
    id_broker_encargado,
    calif_overall, status_promocion
) VALUES (
    'venta', 'casa', 'en fraccionamiento privado', 'residencial',
    1, 'Calle Horacio', '1234',
    'Casa Moderna en Polanco', 'Hermosa casa de 3 niveles con acabados de lujo, jardin y terraza',
    300.00, 450.00,
    8500000.00, 'MXN',
    4, 3, 1, 3,
    2018,
    1,
    'lo mejor', 'promo_activa'
);

-- Casa en Valle Oriente
INSERT INTO inmuebles (
    tipo_operacion, tipo_inmueble, caracterizacion, vocacion,
    id_zona, calle, no_exterior,
    titulo, descripcion,
    medida_terreno, medida_construccion,
    importe_venta, moneda_venta,
    recamaras, banos, medios_banos, estacionamientos,
    ano_construccion,
    id_broker_encargado,
    calif_overall, status_promocion
) VALUES (
    'venta', 'casa', 'en fraccionamiento privado', 'residencial',
    3, 'Av. Lazaro Cardenas', '5678',
    'Residencia Familiar en Valle Oriente', 'Amplia casa familiar con alberca y area de juegos',
    400.00, 380.00,
    6200000.00, 'MXN',
    5, 4, 0, 4,
    2015,
    2,
    'muy bueno', 'promo_activa'
);

-- Casa en Zapopan
INSERT INTO inmuebles (
    tipo_operacion, tipo_inmueble, caracterizacion, vocacion,
    id_zona, calle, no_exterior,
    titulo, descripcion,
    medida_terreno, medida_construccion,
    importe_venta, moneda_venta,
    recamaras, banos, medios_banos, estacionamientos,
    ano_construccion, ano_ultima_remodelacion,
    id_broker_encargado,
    calif_overall, status_promocion
) VALUES (
    'venta', 'casa', 'en privada', 'residencial',
    4, 'Calle Juarez', '234',
    'Casa Colonial en Zapopan', 'Casa estilo colonial mexicano completamente renovada',
    250.00, 320.00,
    4500000.00, 'MXN',
    3, 2, 1, 2,
    2010, 2022,
    3,
    'muy bueno', 'promo_activa'
);

-- Penthouse en Polanco
INSERT INTO inmuebles (
    tipo_operacion, tipo_inmueble, caracterizacion, vocacion,
    id_zona, calle, no_exterior,
    titulo, descripcion,
    medida_construccion,
    importe_venta, moneda_venta,
    recamaras, banos, medios_banos, estacionamientos,
    ano_construccion,
    id_broker_encargado,
    calif_overall, status_promocion
) VALUES (
    'venta', 'departamento', 'en edificio', 'residencial',
    1, 'Av. Presidente Masaryk', '890',
    'Penthouse de Lujo en Polanco', 'Espectacular penthouse con vista panoramica de la ciudad',
    280.00,
    12000000.00, 'MXN',
    3, 3, 0, 2,
    2020,
    1,
    'lo mejor', 'promo_activa'
);

-- Departamento en Zona Esmeralda
INSERT INTO inmuebles (
    tipo_operacion, tipo_inmueble, caracterizacion, vocacion,
    id_zona, calle, no_exterior,
    titulo, descripcion,
    medida_construccion,
    importe_venta, moneda_venta,
    recamaras, banos, medios_banos, estacionamientos,
    ano_construccion,
    id_broker_encargado,
    calif_overall, status_promocion
) VALUES (
    'venta', 'departamento', 'en condominio', 'residencial',
    2, 'Blvd. Esmeralda', '456',
    'Departamento Moderno Zona Esmeralda', 'Departamento nuevo con amenidades completas',
    120.00,
    3200000.00, 'MXN',
    2, 2, 0, 2,
    2022,
    1,
    'nuevo', 'promo_activa'
);

-- Loft en Angelopolis
INSERT INTO inmuebles (
    tipo_operacion, tipo_inmueble, caracterizacion, vocacion,
    id_zona, calle, no_exterior,
    titulo, descripcion,
    medida_construccion,
    importe_venta, moneda_venta,
    recamaras, banos, medios_banos, estacionamientos,
    ano_construccion,
    id_broker_encargado,
    calif_overall, status_promocion
) VALUES (
    'venta', 'departamento', 'en desarrollo', 'residencial',
    5, 'Via Atlixcayotl', '789',
    'Loft Angelopolis', 'Loft estilo industrial en desarrollo moderno',
    95.00,
    2800000.00, 'MXN',
    1, 1, 0, 1,
    2021,
    3,
    'nuevo', 'promo_concluida'
);

-- Terreno Comercial en Valle Oriente
INSERT INTO inmuebles (
    tipo_operacion, tipo_inmueble, vocacion,
    id_zona, calle, no_exterior,
    titulo, descripcion,
    medida_terreno,
    importe_venta, moneda_venta,
    id_broker_encargado,
    calif_overall, status_promocion
) VALUES (
    'venta', 'terreno', 'comercial',
    3, 'Av. San Pedro', '1234',
    'Terreno Comercial Valle Oriente', 'Terreno ideal para desarrollo comercial en zona premium',
    800.00,
    5500000.00, 'MXN',
    2,
    'lo mejor', 'promo_activa'
);

-- Lote Residencial en Zapopan
INSERT INTO inmuebles (
    tipo_operacion, tipo_inmueble, caracterizacion, vocacion,
    id_zona, calle, no_exterior,
    titulo, descripcion,
    medida_terreno,
    importe_venta, moneda_venta,
    id_broker_encargado,
    calif_overall, status_promocion
) VALUES (
    'venta', 'terreno', 'en fraccionamiento privado', 'residencial',
    4, 'Calle Real', '567',
    'Lote Residencial Zapopan', 'Terreno plano listo para construir en fraccionamiento privado',
    350.00,
    1800000.00, 'MXN',
    3,
    'muy bueno', 'promo_activa'
);

-- Terreno en Angelopolis
INSERT INTO inmuebles (
    tipo_operacion, tipo_inmueble, vocacion,
    id_zona, calle, no_exterior,
    titulo, descripcion,
    medida_terreno,
    importe_venta, moneda_venta,
    id_broker_encargado,
    calif_overall, status_promocion
) VALUES (
    'venta', 'terreno', 'residencial',
    5, 'Calle Reforma', '345',
    'Terreno Angelopolis', 'Terreno en esquina con gran potencial de desarrollo',
    500.00,
    2200000.00, 'MXN',
    3,
    'bueno', 'promo_activa'
);

-- Casa en Zona Esmeralda
INSERT INTO inmuebles (
    tipo_operacion, tipo_inmueble, caracterizacion, vocacion,
    id_zona, calle, no_exterior,
    titulo, descripcion,
    medida_terreno, medida_construccion,
    importe_venta, moneda_venta,
    recamaras, banos, medios_banos, estacionamientos,
    ano_construccion,
    id_broker_encargado,
    calif_overall, status_promocion
) VALUES (
    'venta', 'casa', 'en fraccionamiento privado', 'residencial',
    2, 'Calle Bosques', '123',
    'Casa en Venta Zona Esmeralda', 'Casa amplia con jardin y area de servicio completa',
    320.00, 350.00,
    5800000.00, 'MXN',
    4, 3, 0, 2,
    2016,
    1,
    'bueno', 'promo_activa'
);

-- ============================================
-- VERIFICACION
-- ============================================
SELECT 'Datos de ejemplo insertados exitosamente' AS Status;
SELECT COUNT(*) AS Total_Zonas FROM zonas;
SELECT COUNT(*) AS Total_Empresas FROM empresas;
SELECT COUNT(*) AS Total_Brokers FROM personas WHERE clasif_persona = 'Broker';
SELECT COUNT(*) AS Total_Propiedades FROM inmuebles;
