const jwt = require('jsonwebtoken');
const { ROLES, ERROR_MESSAGES } = require('../config/constants');

// Verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_TOKEN
    });
  }
};

// Optional authentication (for tracking anonymous users)
const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } else {
      req.user = { role: ROLES.ANONIMO };
    }

    next();
  } catch (error) {
    req.user = { role: ROLES.ANONIMO };
    next();
  }
};

// Check if user has required role
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN
      });
    }

    next();
  };
};

// Check if user is broker
const requireBroker = requireRole(ROLES.BROKER);

// Check if user is registered (broker or registered visitor)
const requireRegistered = requireRole(ROLES.BROKER, ROLES.VISITANTE_REGISTRADO);

module.exports = {
  verifyToken,
  optionalAuth,
  requireRole,
  requireBroker,
  requireRegistered
};
