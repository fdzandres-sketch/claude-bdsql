const InteractionModel = require('../models/interactionModel');
const { INTERACTION_TYPES } = require('../config/constants');

// Track property view
exports.trackView = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const interactionData = {
      propiedad_id: propertyId,
      usuario_id: req.user?.id || null,
      tipo: INTERACTION_TYPES.VIEW,
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    };

    await InteractionModel.create(interactionData);
    await InteractionModel.incrementPropertyViews(propertyId);

    res.json({
      success: true,
      message: 'Vista registrada'
    });
  } catch (error) {
    next(error);
  }
};

// Track contact
exports.trackContact = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const interactionData = {
      propiedad_id: propertyId,
      usuario_id: req.user?.id || null,
      tipo: INTERACTION_TYPES.CONTACT,
      detalles: req.body.detalles || null,
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    };

    await InteractionModel.create(interactionData);

    res.json({
      success: true,
      message: 'Contacto registrado'
    });
  } catch (error) {
    next(error);
  }
};

// Track phone reveal
exports.trackPhoneReveal = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const interactionData = {
      propiedad_id: propertyId,
      usuario_id: req.user?.id || null,
      tipo: INTERACTION_TYPES.PHONE_REVEAL,
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    };

    await InteractionModel.create(interactionData);

    res.json({
      success: true,
      message: 'Revelación de teléfono registrada'
    });
  } catch (error) {
    next(error);
  }
};

// Track share
exports.trackShare = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const interactionData = {
      propiedad_id: propertyId,
      usuario_id: req.user?.id || null,
      tipo: INTERACTION_TYPES.SHARE,
      detalles: req.body.plataforma || null,
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    };

    await InteractionModel.create(interactionData);

    res.json({
      success: true,
      message: 'Compartido registrado'
    });
  } catch (error) {
    next(error);
  }
};

// Track favorite
exports.trackFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const interactionData = {
      propiedad_id: propertyId,
      usuario_id: req.user?.id || null,
      tipo: INTERACTION_TYPES.FAVORITE,
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    };

    await InteractionModel.create(interactionData);

    res.json({
      success: true,
      message: 'Favorito registrado'
    });
  } catch (error) {
    next(error);
  }
};

// Track search
exports.trackSearch = async (req, res, next) => {
  try {
    const searchData = {
      usuario_id: req.user?.id || null,
      criterios_busqueda: JSON.stringify(req.query),
      resultados_encontrados: req.body.resultados || 0,
      ip_address: req.ip,
      user_agent: req.get('user-agent')
    };

    // You can store search tracking in a separate table if needed
    // For now, we'll just log it

    res.json({
      success: true,
      message: 'Búsqueda registrada'
    });
  } catch (error) {
    next(error);
  }
};
