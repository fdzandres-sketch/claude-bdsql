const PropertyModel = require('../models/propertyModel');
const ZoneModel = require('../models/zoneModel');
const DevelopmentModel = require('../models/developmentModel');
const { paginate, paginationResponse } = require('../utils/helpers');
const { AppError } = require('../middlewares/errorHandler');

// Get all properties (public)
exports.getProperties = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const pagination = paginate(page, limit);

    const filters = {
      tipo_propiedad: req.query.tipo_propiedad,
      tipo_transaccion: req.query.tipo_transaccion,
      zona_id: req.query.zona_id,
      desarrollo_id: req.query.desarrollo_id,
      precio_min: req.query.precio_min,
      precio_max: req.query.precio_max,
      recamaras: req.query.recamaras,
      banos: req.query.banos,
      estacionamientos: req.query.estacionamientos,
      terreno_min: req.query.terreno_min,
      construccion_min: req.query.construccion_min,
      search: req.query.search,
      orden: req.query.orden,
      direccion: req.query.direccion
    };

    const { properties, total } = await PropertyModel.getAll(filters, pagination);

    res.json({
      success: true,
      ...paginationResponse(properties, total, page, limit)
    });
  } catch (error) {
    next(error);
  }
};

// Get property by ID (public)
exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await PropertyModel.getById(req.params.id);

    if (!property) {
      throw new AppError('Propiedad no encontrada', 404);
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

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

// Get zone by ID (public)
exports.getZoneById = async (req, res, next) => {
  try {
    const zone = await ZoneModel.getById(req.params.id);

    if (!zone) {
      throw new AppError('Zona no encontrada', 404);
    }

    res.json({
      success: true,
      data: zone
    });
  } catch (error) {
    next(error);
  }
};

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

// Get development by ID (public)
exports.getDevelopmentById = async (req, res, next) => {
  try {
    const development = await DevelopmentModel.getById(req.params.id);

    if (!development) {
      throw new AppError('Desarrollo no encontrado', 404);
    }

    res.json({
      success: true,
      data: development
    });
  } catch (error) {
    next(error);
  }
};

// Get featured properties (public)
exports.getFeaturedProperties = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;
    const filters = { orden: 'vistas', direccion: 'DESC' };
    const pagination = { limit, offset: 0 };

    const { properties } = await PropertyModel.getAll(filters, pagination);

    res.json({
      success: true,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// Get similar properties (public)
exports.getSimilarProperties = async (req, res, next) => {
  try {
    const property = await PropertyModel.getById(req.params.id);

    if (!property) {
      throw new AppError('Propiedad no encontrada', 404);
    }

    const filters = {
      tipo_propiedad: property.tipo_propiedad,
      tipo_transaccion: property.tipo_transaccion,
      zona_id: property.zona_id
    };

    const pagination = { limit: 4, offset: 0 };
    const { properties } = await PropertyModel.getAll(filters, pagination);

    // Remove current property from results
    const similarProperties = properties.filter(p => p.id !== property.id);

    res.json({
      success: true,
      data: similarProperties
    });
  } catch (error) {
    next(error);
  }
};
