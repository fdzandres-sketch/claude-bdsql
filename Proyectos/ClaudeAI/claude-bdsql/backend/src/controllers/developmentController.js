const DevelopmentModel = require('../models/developmentModel');
const { query } = require('../config/database');
const { AppError } = require('../middlewares/errorHandler');

// Get all developments (public)
exports.getDevelopments = async (req, res, next) => {
  try {
    const developments = await DevelopmentModel.getAll();

    res.json({
      success: true,
      data: developments
    });
  } catch (error) {
    next(error);
  }
};

// Get development by ID with its properties (public)
exports.getDevelopmentById = async (req, res, next) => {
  try {
    const development = await DevelopmentModel.getById(req.params.id);

    if (!development) {
      throw new AppError('Desarrollo no encontrado', 404);
    }

    // Get active properties for this development
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
        status_promocion,
        created_at
      FROM inmuebles
      WHERE id_desarrollo = ? AND status_promocion = 'promo_activa'
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
        ...development,
        propiedades: properties
      }
    });
  } catch (error) {
    next(error);
  }
};
