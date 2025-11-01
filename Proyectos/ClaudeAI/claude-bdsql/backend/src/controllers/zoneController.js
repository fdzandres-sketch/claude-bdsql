const ZoneModel = require('../models/zoneModel');
const { query } = require('../config/database');
const { AppError } = require('../middlewares/errorHandler');

// Get all zones (public)
exports.getZones = async (req, res, next) => {
  try {
    const zones = await ZoneModel.getAll();

    res.json({
      success: true,
      data: zones
    });
  } catch (error) {
    next(error);
  }
};

// Get zone by ID with property statistics (public)
exports.getZoneById = async (req, res, next) => {
  try {
    const zone = await ZoneModel.getById(req.params.id);

    if (!zone) {
      throw new AppError('Zona no encontrada', 404);
    }

    // Get property statistics for this zone
    const statsSQL = `
      SELECT
        COUNT(*) as total_propiedades,
        COUNT(CASE WHEN tipo_transaccion = 'Venta' THEN 1 END) as total_venta,
        COUNT(CASE WHEN tipo_transaccion = 'Renta' THEN 1 END) as total_renta,
        AVG(CASE WHEN tipo_transaccion = 'Venta' THEN precio END) as precio_promedio_venta,
        AVG(CASE WHEN tipo_transaccion = 'Renta' THEN precio END) as precio_promedio_renta,
        MIN(CASE WHEN tipo_transaccion = 'Venta' THEN precio END) as precio_min_venta,
        MAX(CASE WHEN tipo_transaccion = 'Venta' THEN precio END) as precio_max_venta,
        MIN(CASE WHEN tipo_transaccion = 'Renta' THEN precio END) as precio_min_renta,
        MAX(CASE WHEN tipo_transaccion = 'Renta' THEN precio END) as precio_max_renta
      FROM inmuebles
      WHERE id_zona = ? AND status_promocion = 'promo_activa'
    `;

    const [stats] = await query(statsSQL, [req.params.id]);

    res.json({
      success: true,
      data: {
        ...zone,
        estadisticas: stats
      }
    });
  } catch (error) {
    next(error);
  }
};
