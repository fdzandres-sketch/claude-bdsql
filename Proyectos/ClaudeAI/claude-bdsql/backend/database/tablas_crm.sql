-- ============================================================================
-- SCRIPT DE CREACIÓN DE TABLAS CRM
-- ============================================================================
-- Este script contiene las tablas necesarias para el sistema CRM del backend
-- de bienes raíces, incluyendo mensajería, solicitudes de visita y gestión
-- de prospectos.
-- ============================================================================

-- ============================================================================
-- 1. AGREGAR COLUMNAS A LA TABLA PERSONAS
-- ============================================================================
-- Agrega funcionalidad de autenticación y recuperación de contraseña

ALTER TABLE personas
ADD COLUMN password VARCHAR(255) NULL AFTER email,
ADD COLUMN ultimo_login TIMESTAMP NULL,
ADD COLUMN token_recuperacion VARCHAR(255) NULL,
ADD COLUMN token_expiracion TIMESTAMP NULL;

-- ============================================================================
-- 2. TABLA MENSAJES
-- ============================================================================
-- Gestiona la comunicación entre brokers y clientes

CREATE TABLE mensajes (
    id_mensaje INT PRIMARY KEY AUTO_INCREMENT,

    -- Participantes
    id_remitente INT NOT NULL COMMENT 'Puede ser broker o cliente',
    id_destinatario INT NOT NULL COMMENT 'Puede ser broker o cliente',
    id_propiedad INT NULL COMMENT 'Propiedad relacionada al mensaje',

    -- Contenido
    asunto VARCHAR(200),
    mensaje TEXT NOT NULL,

    -- Estado
    leido BOOLEAN DEFAULT FALSE,
    fecha_lectura TIMESTAMP NULL,
    respondido BOOLEAN DEFAULT FALSE,

    -- Metadata
    tipo_mensaje ENUM('consulta', 'respuesta', 'seguimiento', 'otro') DEFAULT 'consulta',
    ip_remitente VARCHAR(45),
    user_agent TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_remitente) REFERENCES personas(id_persona) ON DELETE CASCADE,
    FOREIGN KEY (id_destinatario) REFERENCES personas(id_persona) ON DELETE CASCADE,
    FOREIGN KEY (id_propiedad) REFERENCES inmuebles(id_propiedad) ON DELETE SET NULL,

    INDEX idx_remitente (id_remitente),
    INDEX idx_destinatario (id_destinatario),
    INDEX idx_propiedad (id_propiedad),
    INDEX idx_leido (leido),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Mensajes entre brokers y clientes';

-- ============================================================================
-- 3. TABLA SOLICITUDES_VISITA
-- ============================================================================
-- Gestiona las citas y visitas a propiedades

CREATE TABLE solicitudes_visita (
    id_solicitud INT PRIMARY KEY AUTO_INCREMENT,

    -- Participantes
    id_propiedad INT NOT NULL,
    id_cliente INT NOT NULL COMMENT 'Persona interesada',
    id_broker INT NOT NULL COMMENT 'Broker encargado',

    -- Fecha y hora solicitada
    fecha_solicitada DATE NOT NULL,
    hora_solicitada TIME NOT NULL,
    fecha_confirmada TIMESTAMP NULL,

    -- Datos de contacto
    nombre_cliente VARCHAR(200) NOT NULL,
    email_cliente VARCHAR(200),
    telefono_cliente VARCHAR(20) NOT NULL,

    -- Detalles
    mensaje TEXT,
    notas_broker TEXT COMMENT 'Notas internas del broker',

    -- Estado
    estado ENUM('pendiente', 'confirmada', 'rechazada', 'completada', 'cancelada') DEFAULT 'pendiente',
    fecha_estado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Metadata
    ip_solicitud VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_propiedad) REFERENCES inmuebles(id_propiedad) ON DELETE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES personas(id_persona) ON DELETE CASCADE,
    FOREIGN KEY (id_broker) REFERENCES personas(id_persona) ON DELETE CASCADE,

    INDEX idx_propiedad (id_propiedad),
    INDEX idx_cliente (id_cliente),
    INDEX idx_broker (id_broker),
    INDEX idx_estado (estado),
    INDEX idx_fecha_solicitada (fecha_solicitada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Solicitudes de visita a propiedades';

-- ============================================================================
-- 4. TABLA PROSPECTOS
-- ============================================================================
-- Sistema CRM para gestión de prospectos de brokers

CREATE TABLE prospectos (
    id_prospecto INT PRIMARY KEY AUTO_INCREMENT,

    -- Relaciones
    id_persona INT NOT NULL COMMENT 'Cliente prospecto',
    id_broker_asignado INT NOT NULL,
    id_propiedad_interes INT NULL COMMENT 'Propiedad de interés inicial',

    -- Datos del prospecto
    origen ENUM('web', 'referido', 'evento', 'llamada', 'otro') DEFAULT 'web',
    interes_tipo_operacion ENUM('venta', 'renta', 'ambos'),
    interes_tipo_inmueble VARCHAR(100),
    presupuesto_min DECIMAL(15,2),
    presupuesto_max DECIMAL(15,2),
    zona_interes VARCHAR(200),

    -- Estado del prospecto
    estado ENUM('nuevo', 'contactado', 'interesado', 'negociando', 'cerrado_ganado', 'cerrado_perdido', 'pausado') DEFAULT 'nuevo',
    prioridad ENUM('alta', 'media', 'baja') DEFAULT 'media',

    -- Seguimiento
    ultima_interaccion TIMESTAMP NULL,
    proxima_accion DATE NULL,
    descripcion_proxima_accion VARCHAR(500),

    -- Notas
    notas TEXT,
    motivo_perdida TEXT COMMENT 'Si estado = cerrado_perdido',

    -- Metadata
    fecha_cierre TIMESTAMP NULL,
    valor_cierre DECIMAL(15,2) COMMENT 'Si cerró, cuánto fue',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE CASCADE,
    FOREIGN KEY (id_broker_asignado) REFERENCES personas(id_persona) ON DELETE RESTRICT,
    FOREIGN KEY (id_propiedad_interes) REFERENCES inmuebles(id_propiedad) ON DELETE SET NULL,

    INDEX idx_persona (id_persona),
    INDEX idx_broker (id_broker_asignado),
    INDEX idx_estado (estado),
    INDEX idx_prioridad (prioridad),
    INDEX idx_proxima_accion (proxima_accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Gestión de prospectos CRM para brokers';

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
