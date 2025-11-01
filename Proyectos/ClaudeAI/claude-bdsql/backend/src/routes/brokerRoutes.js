const express = require('express');
const router = express.Router();
const brokerController = require('../controllers/brokerController');
const { verifyToken, requireBroker } = require('../middlewares/auth');
const { createPropertyValidator, updatePropertyValidator, idParamValidator } = require('../middlewares/validators');
const validate = require('../middlewares/validate');

// All routes require broker authentication
router.use(verifyToken, requireBroker);

// Property management
router.get('/properties', brokerController.getMyProperties);
router.post('/properties', [createPropertyValidator, validate], brokerController.createProperty);
router.put('/properties/:id', [idParamValidator, updatePropertyValidator, validate], brokerController.updateProperty);
router.patch('/properties/:id/pause', [idParamValidator, validate], brokerController.pauseProperty);
router.patch('/properties/:id/activate', [idParamValidator, validate], brokerController.activateProperty);
router.patch('/properties/:id/inactivate', [idParamValidator, validate], brokerController.inactivateProperty);
router.post('/properties/:id/clone', [idParamValidator, validate], brokerController.cloneProperty);
router.delete('/properties/:id', [idParamValidator, validate], brokerController.deleteProperty);
router.post('/properties/:id/images', [idParamValidator, validate], brokerController.addPropertyImage);

module.exports = router;
