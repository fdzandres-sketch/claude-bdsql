const CatalogoModel = require('../models/catalogoModel');
const { AppError } = require('../middlewares/errorHandler');

// Get catalog options for a specific field (public)
exports.getCatalogoByCampo = async (req, res, next) => {
  try {
    const { campo } = req.params;

    // Validate field
    if (!CatalogoModel.validFields.includes(campo)) {
      throw new AppError(
        `Campo de cat\u00e1logo inv\u00e1lido. Campos v\u00e1lidos: ${CatalogoModel.validFields.join(', ')}`,
        400
      );
    }

    const options = await CatalogoModel.getByField(campo);

    res.json({
      success: true,
      data: {
        campo: campo,
        opciones: options
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all catalogs grouped by field (public)
exports.getAllCatalogos = async (req, res, next) => {
  try {
    const catalogs = await CatalogoModel.getAll();

    res.json({
      success: true,
      data: {
        campos_disponibles: CatalogoModel.validFields,
        catalogos: catalogs
      }
    });
  } catch (error) {
    next(error);
  }
};
