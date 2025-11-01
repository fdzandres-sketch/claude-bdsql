// User roles
const ROLES = {
  BROKER: 'broker',
  VISITANTE_REGISTRADO: 'visitante_registrado',
  ANONIMO: 'anonimo'
};

// Property status
const PROPERTY_STATUS = {
  ACTIVE: 'activo',
  PAUSED: 'pausado',
  INACTIVE: 'inactivo',
  SOLD: 'vendido',
  RENTED: 'rentado'
};

// Property types
const PROPERTY_TYPES = {
  CASA: 'casa',
  DEPARTAMENTO: 'departamento',
  TERRENO: 'terreno',
  OFICINA: 'oficina',
  LOCAL: 'local',
  BODEGA: 'bodega',
  DESARROLLO: 'desarrollo'
};

// Transaction types
const TRANSACTION_TYPES = {
  VENTA: 'venta',
  RENTA: 'renta',
  TRASPASO: 'traspaso'
};

// Interaction types
const INTERACTION_TYPES = {
  VIEW: 'vista',
  CONTACT: 'contacto',
  VISIT_REQUEST: 'solicitud_visita',
  FAVORITE: 'favorito',
  SHARE: 'compartido',
  PHONE_REVEAL: 'telefono_revelado',
  EMAIL_SENT: 'email_enviado'
};

// Message status
const MESSAGE_STATUS = {
  SENT: 'enviado',
  READ: 'leido',
  REPLIED: 'respondido'
};

// Prospect status
const PROSPECT_STATUS = {
  NEW: 'nuevo',
  CONTACTED: 'contactado',
  INTERESTED: 'interesado',
  NEGOTIATING: 'negociando',
  CLOSED_WON: 'cerrado_ganado',
  CLOSED_LOST: 'cerrado_perdido'
};

// Error messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Acceso denegado',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION_ERROR: 'Error de validación',
  SERVER_ERROR: 'Error interno del servidor',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  USER_EXISTS: 'El usuario ya existe',
  PROPERTY_NOT_FOUND: 'Propiedad no encontrada',
  INVALID_TOKEN: 'Token inválido o expirado'
};

module.exports = {
  ROLES,
  PROPERTY_STATUS,
  PROPERTY_TYPES,
  TRANSACTION_TYPES,
  INTERACTION_TYPES,
  MESSAGE_STATUS,
  PROSPECT_STATUS,
  ERROR_MESSAGES
};
