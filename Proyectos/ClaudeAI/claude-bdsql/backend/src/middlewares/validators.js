const { body, param, query } = require('express-validator');

// Auth validators
exports.registerBrokerValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nombre_completo').notEmpty().withMessage('El nombre completo es requerido'),
  body('telefono').optional().isMobilePhone('es-MX').withMessage('Teléfono inválido'),
  body('cedula_profesional').optional()
];

exports.registerVisitorValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nombre_completo').notEmpty().withMessage('El nombre completo es requerido'),
  body('telefono').optional().isMobilePhone('es-MX').withMessage('Teléfono inválido')
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

// Property validators
exports.createPropertyValidator = [
  body('tipo_propiedad').notEmpty().withMessage('El tipo de propiedad es requerido'),
  body('tipo_transaccion').notEmpty().withMessage('El tipo de transacción es requerido'),
  body('titulo').notEmpty().withMessage('El título es requerido'),
  body('descripcion').notEmpty().withMessage('La descripción es requerida'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('recamaras').optional().isInt({ min: 0 }),
  body('banos').optional().isInt({ min: 0 }),
  body('estacionamientos').optional().isInt({ min: 0 }),
  body('superficie_terreno').optional().isFloat({ min: 0 }),
  body('superficie_construccion').optional().isFloat({ min: 0 })
];

exports.updatePropertyValidator = [
  body('tipo_propiedad').optional(),
  body('tipo_transaccion').optional(),
  body('titulo').optional(),
  body('descripcion').optional(),
  body('precio').optional().isFloat({ min: 0 }),
  body('recamaras').optional().isInt({ min: 0 }),
  body('banos').optional().isInt({ min: 0 })
];

// Message validators
exports.sendMessageValidator = [
  body('propiedad_id').isInt().withMessage('ID de propiedad inválido'),
  body('mensaje').notEmpty().withMessage('El mensaje es requerido'),
  body('nombre').optional(),
  body('email').optional().isEmail(),
  body('telefono').optional()
];

// Visit request validators
exports.visitRequestValidator = [
  body('propiedad_id').isInt().withMessage('ID de propiedad inválido'),
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('telefono').notEmpty().withMessage('El teléfono es requerido'),
  body('fecha_preferida').notEmpty().withMessage('La fecha preferida es requerida'),
  body('hora_preferida').optional(),
  body('mensaje').optional()
];

// Prospect validators
exports.createProspectValidator = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('telefono').optional(),
  body('propiedad_id').optional().isInt(),
  body('origen').optional(),
  body('notas').optional()
];

exports.updateProspectValidator = [
  body('nombre').optional(),
  body('email').optional().isEmail(),
  body('telefono').optional(),
  body('estatus').optional(),
  body('notas').optional()
];

// Prospect interaction validators
exports.prospectInteractionValidator = [
  body('tipo').notEmpty().withMessage('El tipo de interacción es requerido'),
  body('descripcion').optional(),
  body('fecha_seguimiento').optional().isISO8601()
];

// ID parameter validator
exports.idParamValidator = [
  param('id').isInt().withMessage('ID inválido')
];

// Pagination validators
exports.paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Página inválida'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite inválido')
];
