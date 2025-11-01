const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const { optionalAuth } = require('../middlewares/auth');
const { idParamValidator } = require('../middlewares/validators');
const validate = require('../middlewares/validate');

// All tracking routes support optional authentication
router.post('/view/:propertyId', [idParamValidator, validate, optionalAuth], trackingController.trackView);
router.post('/contact/:propertyId', [idParamValidator, validate, optionalAuth], trackingController.trackContact);
router.post('/phone-reveal/:propertyId', [idParamValidator, validate, optionalAuth], trackingController.trackPhoneReveal);
router.post('/share/:propertyId', [idParamValidator, validate, optionalAuth], trackingController.trackShare);
router.post('/favorite/:propertyId', [idParamValidator, validate, optionalAuth], trackingController.trackFavorite);
router.post('/search', [optionalAuth], trackingController.trackSearch);

module.exports = router;
