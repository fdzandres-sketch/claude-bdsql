-- =========================================
-- DATOS DE CATÁLOGOS - Opciones Predefinidas
-- Base de datos inmobiliaria
-- Fecha: 2025-10-30
--
-- Este archivo contiene todos los valores predefinidos para campos
-- de selección múltiple en el sistema
-- =========================================

USE bienesraicesdb;

-- =========================================
-- OTROS_ESPACIOS_RESID (32 opciones)
-- Espacios adicionales en propiedades residenciales
-- =========================================
INSERT INTO catalogos_opciones (nombre_campo, valor_opcion, orden) VALUES
('otros_espacios_resid', 'sala', 1),
('otros_espacios_resid', 'comedor', 2),
('otros_espacios_resid', 'estudio', 3),
('otros_espacios_resid', 'cocina', 4),
('otros_espacios_resid', 'lavanderia', 5),
('otros_espacios_resid', 'sala familiar', 6),
('otros_espacios_resid', 'sala TV', 7),
('otros_espacios_resid', 'desayunador', 8),
('otros_espacios_resid', 'cuarto estudio', 9),
('otros_espacios_resid', 'cuarto de juegos', 10),
('otros_espacios_resid', 'cuarto de servicio', 11),
('otros_espacios_resid', 'cuartos de servicio (2)', 12),
('otros_espacios_resid', 'cuarto de servicio (3)', 13),
('otros_espacios_resid', 'cuarto mozo', 14),
('otros_espacios_resid', 'caseta vigilancia', 15),
('otros_espacios_resid', 'bano de servicio', 16),
('otros_espacios_resid', 'banos de servicio (2)', 17),
('otros_espacios_resid', 'banos de servicio (3)', 18),
('otros_espacios_resid', 'cuarto de huespedes', 19),
('otros_espacios_resid', 'gimnasio', 20),
('otros_espacios_resid', 'bodega', 21),
('otros_espacios_resid', 'bodegas (varias)', 22),
('otros_espacios_resid', 'garage techado', 23),
('otros_espacios_resid', 'elevador', 24),
('otros_espacios_resid', 'terraza', 25),
('otros_espacios_resid', 'terrazas', 26),
('otros_espacios_resid', 'balcones', 27),
('otros_espacios_resid', 'roof terrace', 28),
('otros_espacios_resid', 'alberca (privada)', 29),
('otros_espacios_resid', 'panic room', 30);

-- =========================================
-- OTROS_ESPACIOS_NO_RESID (12 opciones)
-- Espacios adicionales en propiedades no residenciales
-- =========================================
INSERT INTO catalogos_opciones (nombre_campo, valor_opcion, orden) VALUES
('otros_espacios_no_resid', 'cubiculos', 1),
('otros_espacios_no_resid', 'anden de carga', 2),
('otros_espacios_no_resid', 'espuela de tren', 3),
('otros_espacios_no_resid', 'area oficinas', 4),
('otros_espacios_no_resid', 'bodega', 5),
('otros_espacios_no_resid', 'patio de maniobras', 6),
('otros_espacios_no_resid', 'porteros', 7),
('otros_espacios_no_resid', 'pista aterrizaje', 8),
('otros_espacios_no_resid', 'helipuerto', 9),
('otros_espacios_no_resid', 'bano ganado', 10),
('otros_espacios_no_resid', 'corrales', 11),
('otros_espacios_no_resid', 'granero', 12);

-- =========================================
-- AREAS_COMUNES (17 opciones)
-- Áreas comunes en desarrollos y condominios
-- =========================================
INSERT INTO catalogos_opciones (nombre_campo, valor_opcion, orden) VALUES
('areas_comunes', 'alberca', 1),
('areas_comunes', 'alberca techada', 2),
('areas_comunes', 'gimnasio', 3),
('areas_comunes', 'jardines', 4),
('areas_comunes', 'juegos para ninos', 5),
('areas_comunes', 'salon de fiestas', 6),
('areas_comunes', 'salon de adultos', 7),
('areas_comunes', 'vestibulo', 8),
('areas_comunes', 'motor lobby', 9),
('areas_comunes', 'jacuzzi', 10),
('areas_comunes', 'vestidores', 11),
('areas_comunes', 'asadores', 12),
('areas_comunes', 'paddle tennis', 13),
('areas_comunes', 'tennis', 14),
('areas_comunes', 'business center', 15),
('areas_comunes', 'juegos infantiles', 16),
('areas_comunes', 'cafeteria', 17);

-- =========================================
-- SERVICIOS_RESID (11 opciones)
-- Servicios en propiedades residenciales
-- =========================================
INSERT INTO catalogos_opciones (nombre_campo, valor_opcion, orden) VALUES
('servicios_resid', 'cisterna', 1),
('servicios_resid', 'hidroneumatico', 2),
('servicios_resid', 'paneles solares', 3),
('servicios_resid', 'filtros de agua potable', 4),
('servicios_resid', 'vigilancia 24 horas', 5),
('servicios_resid', 'servicio de video vigilancia', 6),
('servicios_resid', 'sistema de alarma', 7),
('servicios_resid', 'pozo', 8),
('servicios_resid', 'riego', 9),
('servicios_resid', 'bardeado', 10),
('servicios_resid', 'potreros', 11);

-- =========================================
-- SERVICIOS_NO_RESID (8 opciones)
-- Servicios en propiedades no residenciales
-- =========================================
INSERT INTO catalogos_opciones (nombre_campo, valor_opcion, orden) VALUES
('servicios_no_resid', 'planta de tratamiento', 1),
('servicios_no_resid', 'conexion agua', 2),
('servicios_no_resid', 'conexion electrica', 3),
('servicios_no_resid', 'acceso a transporte publico', 4),
('servicios_no_resid', 'acceso a carretera local', 5),
('servicios_no_resid', 'acceso a carretera estatal', 6),
('servicios_no_resid', 'acceso a carretera federal', 7),
('servicios_no_resid', 'elevador de carga', 8);

-- =========================================
-- CALIF_TERRENO_BRK (10 opciones)
-- Calificaciones de terreno por parte del broker
-- =========================================
INSERT INTO catalogos_opciones (nombre_campo, valor_opcion, orden) VALUES
('calif_terreno_brk', 'plano', 1),
('calif_terreno_brk', 'regular', 2),
('calif_terreno_brk', 'irregular', 3),
('calif_terreno_brk', 'descendente', 4),
('calif_terreno_brk', 'ascendente', 5),
('calif_terreno_brk', 'rodeado de edificios', 6),
('calif_terreno_brk', 'uso de suelo mas de 3 niveles', 7),
('calif_terreno_brk', 'uso de suelo comercial', 8),
('calif_terreno_brk', 'uso de suelo oficina', 9),
('calif_terreno_brk', 'uso de suelo industrial o bodega', 10);

-- =========================================
-- CALIF_CONSTRUCCION_BRK (22 opciones)
-- Calificaciones de construcción por parte del broker
-- =========================================
INSERT INTO catalogos_opciones (nombre_campo, valor_opcion, orden) VALUES
('calif_construccion_brk', 'nuevo', 1),
('calif_construccion_brk', 'muy bueno', 2),
('calif_construccion_brk', 'bueno', 3),
('calif_construccion_brk', 'regular', 4),
('calif_construccion_brk', 'para remodelar', 5),
('calif_construccion_brk', 'para modificaciones mayores', 6),
('calif_construccion_brk', 'estilo moderno', 7),
('calif_construccion_brk', 'estilo contemporaneo', 8),
('calif_construccion_brk', 'estilo colonial', 9),
('calif_construccion_brk', 'estilizado', 10),
('calif_construccion_brk', 'finos acabados', 11),
('calif_construccion_brk', 'buenos acabados', 12),
('calif_construccion_brk', 'bien cuidado', 13),
('calif_construccion_brk', 'algunos detalles p arreglo', 14),
('calif_construccion_brk', 'recien remodelado', 15),
('calif_construccion_brk', 'mucha luz', 16),
('calif_construccion_brk', 'techos altos', 17),
('calif_construccion_brk', 'mas de 2 niveles', 18),
('calif_construccion_brk', 'un solo nivel', 19),
('calif_construccion_brk', 'espacios integrados', 20),
('calif_construccion_brk', 'amplios espacios', 21),
('calif_construccion_brk', 'buena vista', 22);

-- =========================================
-- CALIF_ENTORNO_BRK (12 opciones)
-- Calificaciones del entorno por parte del broker
-- =========================================
INSERT INTO catalogos_opciones (nombre_campo, valor_opcion, orden) VALUES
('calif_entorno_brk', 'exclusivo fraccionamiento', 1),
('calif_entorno_brk', 'exclusiva privada', 2),
('calif_entorno_brk', 'exclusivo desarrollo', 3),
('calif_entorno_brk', 'excelente ubicacion', 4),
('calif_entorno_brk', 'calle tranquila', 5),
('calif_entorno_brk', 'zona segura', 6),
('calif_entorno_brk', 'acceso a vialidades importantes', 7),
('calif_entorno_brk', 'entorno verde', 8),
('calif_entorno_brk', 'zona de calidad', 9),
('calif_entorno_brk', 'zona centrica', 10),
('calif_entorno_brk', 'escuelas y comercios cercanos', 11),
('calif_entorno_brk', 'clubes cerca', 12);

-- =========================================
-- FIN DE CATÁLOGOS
-- =========================================
