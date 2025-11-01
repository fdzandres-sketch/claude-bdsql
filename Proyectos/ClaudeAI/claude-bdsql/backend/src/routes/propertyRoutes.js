const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { optionalAuth } = require('../middlewares/auth');
const { paginationValidator } = require('../middlewares/validators');
const validate = require('../middlewares/validate');

// Public routes
router.get('/', [paginationValidator, validate, optionalAuth], propertyController.getProperties);
router.get('/featured', optionalAuth, propertyController.getFeaturedProperties);
router.get('/zones', propertyController.getZones);
router.get('/zones/:id', propertyController.getZoneById);
router.get('/developments', propertyController.getDevelopments);
router.get('/developments/:id', propertyController.getDevelopmentById);
router.get('/:id', optionalAuth, propertyController.getPropertyById);
router.get('/:id/similar', propertyController.getSimilarProperties);

module.exports = router;
