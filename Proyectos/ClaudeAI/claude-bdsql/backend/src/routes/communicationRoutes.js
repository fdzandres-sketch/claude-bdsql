const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const { verifyToken, requireBroker, optionalAuth } = require('../middlewares/auth');
const { sendMessageValidator, visitRequestValidator, idParamValidator } = require('../middlewares/validators');
const validate = require('../middlewares/validate');

// Public/optional auth routes
router.post('/contact', [optionalAuth, sendMessageValidator, validate], communicationController.contactBroker);
router.post('/visit-requests', [optionalAuth, visitRequestValidator, validate], communicationController.requestVisit);

// Authenticated user routes
router.get('/conversations', verifyToken, communicationController.getConversations);
router.get('/conversations/:propertyId/:otherUserId', verifyToken, communicationController.getConversationMessages);
router.post('/conversations/:propertyId/:otherUserId', verifyToken, communicationController.sendMessage);
router.get('/unread-count', verifyToken, communicationController.getUnreadCount);
router.get('/my-visit-requests', verifyToken, communicationController.getUserVisitRequests);

// Broker routes
router.get('/broker/visit-requests', [verifyToken, requireBroker], communicationController.getBrokerVisitRequests);
router.patch('/broker/visit-requests/:id', [verifyToken, requireBroker, idParamValidator, validate], communicationController.updateVisitStatus);

module.exports = router;
