const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');

// Public routes - no authentication required
router.get('/', zoneController.getZones);
router.get('/:id', zoneController.getZoneById);

module.exports = router;
