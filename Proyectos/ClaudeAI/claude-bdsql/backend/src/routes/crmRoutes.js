const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crmController');
const { verifyToken, requireBroker } = require('../middlewares/auth');
const { createProspectValidator, updateProspectValidator, prospectInteractionValidator, idParamValidator } = require('../middlewares/validators');
const validate = require('../middlewares/validate');

// All routes require broker authentication
router.use(verifyToken, requireBroker);

// Prospects
router.get('/prospects', crmController.getProspects);
router.get('/prospects/stats', crmController.getProspectStats);
router.get('/prospects/:id', [idParamValidator, validate], crmController.getProspectById);
router.post('/prospects', [createProspectValidator, validate], crmController.createProspect);
router.put('/prospects/:id', [idParamValidator, updateProspectValidator, validate], crmController.updateProspect);
router.delete('/prospects/:id', [idParamValidator, validate], crmController.deleteProspect);
router.post('/prospects/:id/interactions', [idParamValidator, prospectInteractionValidator, validate], crmController.addProspectInteraction);

// Interactions & Stats
router.get('/interactions', crmController.getBrokerInteractions);
router.get('/stats', crmController.getBrokerStats);
router.get('/properties/:id/interactions', [idParamValidator, validate], crmController.getPropertyInteractions);
router.get('/properties/:id/stats', [idParamValidator, validate], crmController.getPropertyStats);

module.exports = router;
