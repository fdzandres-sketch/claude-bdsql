const PropertyModel = require('../models/propertyModel');
const { AppError } = require('../middlewares/errorHandler');

// Get broker's properties
exports.getMyProperties = async (req, res, next) => {
  try {
    const brokerId = req.user.id;
    const filters = { estatus: req.query.estatus };

    const properties = await PropertyModel.getByBroker(brokerId, filters);

    res.json({
      success: true,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// Create property
exports.createProperty = async (req, res, next) => {
  try {
    const propertyData = {
      ...req.body,
      broker_id: req.user.id
    };

    const propertyId = await PropertyModel.create(propertyData);

    // Add images if provided
    if (req.body.imagenes && Array.isArray(req.body.imagenes)) {
      for (const image of req.body.imagenes) {
        await PropertyModel.addImage(propertyId, image);
      }
    }

    // Add amenities if provided
    if (req.body.amenidades && Array.isArray(req.body.amenidades)) {
      for (const amenityId of req.body.amenidades) {
        await PropertyModel.addAmenity(propertyId, amenityId);
      }
    }

    const property = await PropertyModel.getById(propertyId);

    res.status(201).json({
      success: true,
      message: 'Propiedad creada exitosamente',
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// Update property
exports.updateProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const brokerId = req.user.id;

    // Verify ownership
    const property = await PropertyModel.getById(propertyId);
    if (!property || property.broker_id !== brokerId) {
      throw new AppError('No tienes permiso para editar esta propiedad', 403);
    }

    await PropertyModel.update(propertyId, req.body);

    // Update amenities if provided
    if (req.body.amenidades && Array.isArray(req.body.amenidades)) {
      // Remove all current amenities and add new ones
      const currentAmenities = property.amenidades || [];
      for (const amenity of currentAmenities) {
        await PropertyModel.removeAmenity(propertyId, amenity.id);
      }

      for (const amenityId of req.body.amenidades) {
        await PropertyModel.addAmenity(propertyId, amenityId);
      }
    }

    const updatedProperty = await PropertyModel.getById(propertyId);

    res.json({
      success: true,
      message: 'Propiedad actualizada exitosamente',
      data: updatedProperty
    });
  } catch (error) {
    next(error);
  }
};

// Pause property
exports.pauseProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const brokerId = req.user.id;

    // Verify ownership
    const property = await PropertyModel.getById(propertyId);
    if (!property || property.broker_id !== brokerId) {
      throw new AppError('No tienes permiso para pausar esta propiedad', 403);
    }

    await PropertyModel.updateStatus(propertyId, 'pausado');

    res.json({
      success: true,
      message: 'Propiedad pausada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Activate property
exports.activateProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const brokerId = req.user.id;

    // Verify ownership
    const property = await PropertyModel.getById(propertyId);
    if (!property || property.broker_id !== brokerId) {
      throw new AppError('No tienes permiso para activar esta propiedad', 403);
    }

    await PropertyModel.updateStatus(propertyId, 'activo');

    res.json({
      success: true,
      message: 'Propiedad activada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Inactivate property
exports.inactivateProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const brokerId = req.user.id;

    // Verify ownership
    const property = await PropertyModel.getById(propertyId);
    if (!property || property.broker_id !== brokerId) {
      throw new AppError('No tienes permiso para inactivar esta propiedad', 403);
    }

    await PropertyModel.updateStatus(propertyId, 'inactivo');

    res.json({
      success: true,
      message: 'Propiedad inactivada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Clone property
exports.cloneProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const brokerId = req.user.id;

    const newPropertyId = await PropertyModel.clone(propertyId, brokerId);

    if (!newPropertyId) {
      throw new AppError('No se pudo clonar la propiedad', 400);
    }

    const newProperty = await PropertyModel.getById(newPropertyId);

    res.status(201).json({
      success: true,
      message: 'Propiedad clonada exitosamente',
      data: newProperty
    });
  } catch (error) {
    next(error);
  }
};

// Delete property
exports.deleteProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const brokerId = req.user.id;

    // Verify ownership
    const property = await PropertyModel.getById(propertyId);
    if (!property || property.broker_id !== brokerId) {
      throw new AppError('No tienes permiso para eliminar esta propiedad', 403);
    }

    await PropertyModel.delete(propertyId);

    res.json({
      success: true,
      message: 'Propiedad eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Add image to property
exports.addPropertyImage = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const brokerId = req.user.id;

    // Verify ownership
    const property = await PropertyModel.getById(propertyId);
    if (!property || property.broker_id !== brokerId) {
      throw new AppError('No tienes permiso para modificar esta propiedad', 403);
    }

    await PropertyModel.addImage(propertyId, req.body);

    res.status(201).json({
      success: true,
      message: 'Imagen agregada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};
