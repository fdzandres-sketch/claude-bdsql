const express = require('express');
const router = express.Router();
const publicBrokerController = require('../controllers/publicBrokerController');

// Public routes - no authentication required
router.get('/', publicBrokerController.getBrokers);
router.get('/:id', publicBrokerController.getBrokerById);

module.exports = router;
