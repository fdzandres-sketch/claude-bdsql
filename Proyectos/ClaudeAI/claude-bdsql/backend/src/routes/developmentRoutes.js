const express = require('express');
const router = express.Router();
const developmentController = require('../controllers/developmentController');

// Public routes - no authentication required
router.get('/', developmentController.getDevelopments);
router.get('/:id', developmentController.getDevelopmentById);

module.exports = router;
