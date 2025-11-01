const express = require('express');
const router = express.Router();
const catalogoController = require('../controllers/catalogoController');

// Public routes - no authentication required
router.get('/', catalogoController.getAllCatalogos);
router.get('/:campo', catalogoController.getCatalogoByCampo);

module.exports = router;
