const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');
const { registerBrokerValidator, registerVisitorValidator, loginValidator, idParamValidator } = require('../middlewares/validators');
const validate = require('../middlewares/validate');

// Public routes
router.post('/register/broker', [registerBrokerValidator, validate], authController.registerBroker);
router.post('/register/visitor', [registerVisitorValidator, validate], authController.registerVisitor);
router.post('/login', [loginValidator, validate], authController.login);

// Brokers directory (public)
router.get('/brokers', authController.getBrokersDirectory);
router.get('/brokers/:id', [idParamValidator, validate], authController.getBrokerPublicProfile);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.post('/change-password', verifyToken, authController.changePassword);

module.exports = router;
