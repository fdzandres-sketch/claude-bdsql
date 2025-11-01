const { query } = require('../config/database');
const { AppError } = require('../middlewares/errorHandler');

// Get all brokers (public directory)
exports.getBrokers = async (req, res, next) => {
  try {
    const sql = `
      SELECT
        p.id_persona as id,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as nombre_completo,
        p.email,
        p.mobil,
        e.marca_inmobiliaria,
        COUNT(i.id_propiedad) as total_propiedades_activas
      FROM personas p
      LEFT JOIN empresas e ON p.id_empresa_vinc = e.id_empresa
      LEFT JOIN inmuebles i ON p.id_persona = i.id_broker_encargado AND i.status_promocion = 'promo_activa'
      WHERE p.clasif_persona = 'Broker'
      GROUP BY p.id_persona
      ORDER BY total_propiedades_activas DESC, nombre_completo ASC
    `;

    const brokers = await query(sql);

    res.json({
      success: true,
      data: brokers
    });
  } catch (error) {
    next(error);
  }
};

// Get broker by ID with public profile (public)
exports.getBrokerById = async (req, res, next) => {
  try {
    // Get broker info
    const brokerSQL = `
      SELECT
        p.id_persona as id,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as nombre_completo,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.email,
        p.mobil,
        e.marca_inmobiliaria,
        p.nota_persona as biografia,
        p.created_at as fecha_registro
      FROM personas p
      LEFT JOIN empresas e ON p.id_empresa_vinc = e.id_empresa
      WHERE p.id_persona = ? AND p.clasif_persona = 'Broker'
    `;

    const [broker] = await query(brokerSQL, [req.params.id]);

    if (!broker) {
      throw new AppError('Broker no encontrado', 404);
    }

    // Get broker's active properties
    const propertiesSQL = `
      SELECT
        id_propiedad as id,
        titulo,
        tipo_propiedad,
        tipo_transaccion,
        precio,
        recamaras,
        banos,
        estacionamientos,
        m2_terreno,
        m2_construccion,
        fotos,
        descripcion_breve,
        created_at
      FROM inmuebles
      WHERE id_persona = ? AND status_promocion = 'promo_activa'
      ORDER BY created_at DESC
    `;

    const properties = await query(propertiesSQL, [req.params.id]);

    // Parse fotos JSON if exists
    properties.forEach(prop => {
      if (prop.fotos && typeof prop.fotos === 'string') {
        try {
          prop.fotos = JSON.parse(prop.fotos);
        } catch (e) {
          prop.fotos = [];
        }
      }
    });

    res.json({
      success: true,
      data: {
        ...broker,
        propiedades_activas: properties
      }
    });
  } catch (error) {
    next(error);
  }
};
