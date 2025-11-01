const UserModel = require('../models/userModel');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const { sanitizeUser } = require('../utils/helpers');
const { AppError } = require('../middlewares/errorHandler');
const { ROLES, ERROR_MESSAGES } = require('../config/constants');

// Register broker
exports.registerBroker = async (req, res, next) => {
  try {
    const { email, password, nombre_completo, telefono, cedula_profesional } = req.body;

    // Check if user exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.USER_EXISTS, 400);
    }

    // Create broker
    const userId = await UserModel.create({
      email,
      password,
      nombre_completo,
      telefono,
      rol: ROLES.BROKER,
      cedula_profesional
    });

    const user = await UserModel.findById(userId);
    const token = generateToken({ id: user.id, email: user.email, role: user.rol });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.status(201).json({
      success: true,
      message: 'Broker registrado exitosamente',
      data: {
        user: sanitizeUser(user),
        token,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Register visitor
exports.registerVisitor = async (req, res, next) => {
  try {
    const { email, password, nombre_completo, telefono } = req.body;

    // Check if user exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.USER_EXISTS, 400);
    }

    // Create visitor
    const userId = await UserModel.create({
      email,
      password,
      nombre_completo,
      telefono,
      rol: ROLES.VISITANTE_REGISTRADO
    });

    const user = await UserModel.findById(userId);
    const token = generateToken({ id: user.id, email: user.email, role: user.rol });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: sanitizeUser(user),
        token,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Check if user is active
    if (!user.activo) {
      throw new AppError('Usuario desactivado', 401);
    }

    // Verify password
    const isValidPassword = await UserModel.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Update last login
    await UserModel.updateLastLogin(user.id);

    // Generate tokens
    const token = generateToken({ id: user.id, email: user.email, role: user.rol });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: sanitizeUser(user),
        token,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { nombre_completo, telefono, biografia, foto_perfil, cedula_profesional } = req.body;

    await UserModel.update(userId, {
      nombre_completo,
      telefono,
      biografia,
      foto_perfil,
      cedula_profesional
    });

    const updatedUser = await UserModel.findById(userId);

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await UserModel.findByEmail(req.user.email);

    // Verify current password
    const isValidPassword = await UserModel.verifyPassword(currentPassword, user.password);
    if (!isValidPassword) {
      throw new AppError('Contraseña actual incorrecta', 400);
    }

    // Update password
    await UserModel.update(userId, { password: newPassword });

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Get brokers directory (public)
exports.getBrokersDirectory = async (req, res, next) => {
  try {
    const filters = {
      verificado: req.query.verificado,
      search: req.query.search
    };

    const brokers = await UserModel.getAllBrokers(filters);

    res.json({
      success: true,
      data: brokers
    });
  } catch (error) {
    next(error);
  }
};

// Get broker public profile
exports.getBrokerPublicProfile = async (req, res, next) => {
  try {
    const broker = await UserModel.getBrokerProfile(req.params.id);

    if (!broker) {
      throw new AppError('Broker no encontrado', 404);
    }

    res.json({
      success: true,
      data: broker
    });
  } catch (error) {
    next(error);
  }
};
