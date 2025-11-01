const { ERROR_MESSAGES } = require('../config/constants');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    error.message = 'El recurso ya existe';
    error.statusCode = 400;
  }

  // MySQL foreign key constraint error
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    error.message = 'Referencia inválida';
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = ERROR_MESSAGES.INVALID_TOKEN;
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expirado';
    error.statusCode = 401;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = ERROR_MESSAGES.VALIDATION_ERROR;
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || ERROR_MESSAGES.SERVER_ERROR,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 Not Found handler
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: ERROR_MESSAGES.NOT_FOUND,
    path: req.originalUrl
  });
};

module.exports = {
  AppError,
  errorHandler,
  notFound
};
