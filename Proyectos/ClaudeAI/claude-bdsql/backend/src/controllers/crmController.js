const ProspectModel = require('../models/prospectModel');
const InteractionModel = require('../models/interactionModel');
const { AppError } = require('../middlewares/errorHandler');

// Get broker's prospects
exports.getProspects = async (req, res, next) => {
  try {
    const brokerId = req.user.id;
    const filters = {
      estatus: req.query.estatus,
      propiedad_id: req.query.propiedad_id,
      search: req.query.search
    };

    const prospects = await ProspectModel.getByBroker(brokerId, filters);

    res.json({
      success: true,
      data: prospects
    });
  } catch (error) {
    next(error);
  }
};

// Get prospect by ID
exports.getProspectById = async (req, res, next) => {
  try {
    const prospectId = req.params.id;
    const brokerId = req.user.id;

    const prospect = await ProspectModel.getById(prospectId);

    if (!prospect || prospect.broker_id !== brokerId) {
      throw new AppError('Prospecto no encontrado', 404);
    }

    // Get interactions
    const interactions = await ProspectModel.getInteractions(prospectId);
    prospect.interacciones = interactions;

    res.json({
      success: true,
      data: prospect
    });
  } catch (error) {
    next(error);
  }
};

// Create prospect
exports.createProspect = async (req, res, next) => {
  try {
    const prospectData = {
      ...req.body,
      broker_id: req.user.id
    };

    const prospectId = await ProspectModel.create(prospectData);
    const prospect = await ProspectModel.getById(prospectId);

    res.status(201).json({
      success: true,
      message: 'Prospecto creado exitosamente',
      data: prospect
    });
  } catch (error) {
    next(error);
  }
};

// Update prospect
exports.updateProspect = async (req, res, next) => {
  try {
    const prospectId = req.params.id;
    const brokerId = req.user.id;

    // Verify ownership
    const prospect = await ProspectModel.getById(prospectId);
    if (!prospect || prospect.broker_id !== brokerId) {
      throw new AppError('No tienes permiso para editar este prospecto', 403);
    }

    await ProspectModel.update(prospectId, req.body);
    const updatedProspect = await ProspectModel.getById(prospectId);

    res.json({
      success: true,
      message: 'Prospecto actualizado exitosamente',
      data: updatedProspect
    });
  } catch (error) {
    next(error);
  }
};

// Delete prospect
exports.deleteProspect = async (req, res, next) => {
  try {
    const prospectId = req.params.id;
    const brokerId = req.user.id;

    // Verify ownership
    const prospect = await ProspectModel.getById(prospectId);
    if (!prospect || prospect.broker_id !== brokerId) {
      throw new AppError('No tienes permiso para eliminar este prospecto', 403);
    }

    await ProspectModel.delete(prospectId);

    res.json({
      success: true,
      message: 'Prospecto eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Add interaction to prospect
exports.addProspectInteraction = async (req, res, next) => {
  try {
    const prospectId = req.params.id;
    const brokerId = req.user.id;

    // Verify ownership
    const prospect = await ProspectModel.getById(prospectId);
    if (!prospect || prospect.broker_id !== brokerId) {
      throw new AppError('No tienes permiso para modificar este prospecto', 403);
    }

    const interactionData = {
      prospecto_id: prospectId,
      ...req.body
    };

    const interactionId = await ProspectModel.addInteraction(interactionData);

    res.status(201).json({
      success: true,
      message: 'Interacción agregada exitosamente',
      data: { id: interactionId }
    });
  } catch (error) {
    next(error);
  }
};

// Get prospect stats
exports.getProspectStats = async (req, res, next) => {
  try {
    const brokerId = req.user.id;
    const stats = await ProspectModel.getStatsByBroker(brokerId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Get property interactions
exports.getPropertyInteractions = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const filters = {
      tipo: req.query.tipo,
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta
    };

    const interactions = await InteractionModel.getByProperty(propertyId, filters);

    res.json({
      success: true,
      data: interactions
    });
  } catch (error) {
    next(error);
  }
};

// Get broker interactions
exports.getBrokerInteractions = async (req, res, next) => {
  try {
    const brokerId = req.user.id;
    const filters = {
      tipo: req.query.tipo,
      propiedad_id: req.query.propiedad_id,
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta
    };

    const interactions = await InteractionModel.getByBroker(brokerId, filters);

    res.json({
      success: true,
      data: interactions
    });
  } catch (error) {
    next(error);
  }
};

// Get property stats
exports.getPropertyStats = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const stats = await InteractionModel.getStatsByProperty(propertyId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Get broker stats
exports.getBrokerStats = async (req, res, next) => {
  try {
    const brokerId = req.user.id;
    const filters = {
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta
    };

    const stats = await InteractionModel.getStatsByBroker(brokerId, filters);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
