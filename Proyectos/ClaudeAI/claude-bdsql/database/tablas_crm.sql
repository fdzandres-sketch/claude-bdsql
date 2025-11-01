-- =============================================
-- SISTEMA CRM INMOBILIARIO - TABLAS ADICIONALES
-- =============================================
-- Modificaciones a la tabla personas y nuevas tablas para el CRM inmobiliario
-- =============================================

-- 1. ALTER TABLE personas - Agregar columnas de autenticación y estado
ALTER TABLE personas
ADD COLUMN password VARCHAR(255) NULL AFTER email,
ADD COLUMN ultimo_login TIMESTAMP NULL,
ADD COLUMN token_recuperacion VARCHAR(255) NULL,
ADD COLUMN token_expiracion TIMESTAMP NULL,
ADD COLUMN activo BOOLEAN DEFAULT TRUE AFTER clasif_persona,
ADD COLUMN fecha_inactivacion TIMESTAMP NULL,
ADD COLUMN motivo_inactivacion VARCHAR(500);

-- 2. CREATE TABLE mensajes - Sistema de mensajería interna
CREATE TABLE mensajes (
    id_mensaje INT PRIMARY KEY AUTO_INCREMENT,
    id_remitente INT NOT NULL,
    id_destinatario INT NOT NULL,
    id_propiedad INT NULL,
    asunto VARCHAR(200),
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha_lectura TIMESTAMP NULL,
    respondido BOOLEAN DEFAULT FALSE,
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
    INDEX idx_leido (leido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CREATE TABLE solicitudes_visita - Gestión de visitas a propiedades
CREATE TABLE solicitudes_visita (
    id_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    id_propiedad INT NOT NULL,
    id_cliente INT NOT NULL,
    id_broker INT NOT NULL,
    fecha_solicitada DATE NOT NULL,
    hora_solicitada TIME NOT NULL,
    fecha_confirmada TIMESTAMP NULL,
    nombre_cliente VARCHAR(200) NOT NULL,
    email_cliente VARCHAR(200),
    telefono_cliente VARCHAR(20) NOT NULL,
    mensaje TEXT,
    notas_broker TEXT,
    estado ENUM('pendiente', 'confirmada', 'rechazada', 'completada', 'cancelada') DEFAULT 'pendiente',
    fecha_estado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ip_solicitud VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_propiedad) REFERENCES inmuebles(id_propiedad) ON DELETE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES personas(id_persona) ON DELETE CASCADE,
    FOREIGN KEY (id_broker) REFERENCES personas(id_persona) ON DELETE CASCADE,

    INDEX idx_propiedad (id_propiedad),
    INDEX idx_cliente (id_cliente),
    INDEX idx_broker (id_broker),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CREATE TABLE prospectos - Gestión de prospectos inmobiliarios
CREATE TABLE prospectos (
    id_prospecto INT PRIMARY KEY AUTO_INCREMENT,
    id_persona INT NOT NULL,
    id_broker_asignado INT NOT NULL,
    id_propiedad_interes INT NULL,
    origen ENUM('web', 'referido', 'evento', 'llamada', 'otro') DEFAULT 'web',
    interes_tipo_operacion ENUM('venta', 'renta', 'ambos'),
    interes_tipo_inmueble VARCHAR(100),
    presupuesto_min DECIMAL(15,2),
    presupuesto_max DECIMAL(15,2),
    zona_interes VARCHAR(200),
    estado ENUM('nuevo', 'contactado', 'interesado', 'negociando', 'cerrado_ganado', 'cerrado_perdido', 'pausado') DEFAULT 'nuevo',
    prioridad ENUM('alta', 'media', 'baja') DEFAULT 'media',
    ultima_interaccion TIMESTAMP NULL,
    proxima_accion DATE NULL,
    descripcion_proxima_accion VARCHAR(500),
    notas TEXT,
    motivo_perdida TEXT,
    fecha_cierre TIMESTAMP NULL,
    valor_cierre DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE CASCADE,
    FOREIGN KEY (id_broker_asignado) REFERENCES personas(id_persona) ON DELETE RESTRICT,
    FOREIGN KEY (id_propiedad_interes) REFERENCES inmuebles(id_propiedad) ON DELETE SET NULL,

    INDEX idx_persona (id_persona),
    INDEX idx_broker (id_broker_asignado),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- FIN DEL SCRIPT
-- =============================================
