const MessageModel = require('../models/messageModel');
const VisitModel = require('../models/visitModel');
const PropertyModel = require('../models/propertyModel');
const { AppError } = require('../middlewares/errorHandler');

// Contact broker (send message)
exports.contactBroker = async (req, res, next) => {
  try {
    const { propiedad_id, mensaje, nombre, email, telefono } = req.body;

    // Get property to find broker
    const property = await PropertyModel.getById(propiedad_id);
    if (!property) {
      throw new AppError('Propiedad no encontrada', 404);
    }

    const messageData = {
      propiedad_id,
      destinatario_id: property.broker_id,
      remitente_id: req.user?.id || null,
      mensaje
    };

    const messageId = await MessageModel.create(messageData);

    res.status(201).json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      data: { id: messageId }
    });
  } catch (error) {
    next(error);
  }
};

// Request visit
exports.requestVisit = async (req, res, next) => {
  try {
    const visitData = {
      ...req.body,
      usuario_id: req.user?.id || null
    };

    // Verify property exists
    const property = await PropertyModel.getById(req.body.propiedad_id);
    if (!property) {
      throw new AppError('Propiedad no encontrada', 404);
    }

    const visitId = await VisitModel.create(visitData);

    res.status(201).json({
      success: true,
      message: 'Solicitud de visita enviada exitosamente',
      data: { id: visitId }
    });
  } catch (error) {
    next(error);
  }
};

// Get conversations (for logged-in users)
exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversations = await MessageModel.getUserConversations(userId);

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

// Get conversation messages
exports.getConversationMessages = async (req, res, next) => {
  try {
    const { propertyId, otherUserId } = req.params;
    const userId = req.user.id;

    const messages = await MessageModel.getConversation(
      propertyId,
      userId,
      otherUserId
    );

    // Mark messages as read
    await MessageModel.markAsRead(propertyId, userId, otherUserId);

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// Send message in conversation
exports.sendMessage = async (req, res, next) => {
  try {
    const { propertyId, otherUserId } = req.params;
    const { mensaje } = req.body;
    const userId = req.user.id;

    const messageData = {
      propiedad_id: propertyId,
      remitente_id: userId,
      destinatario_id: otherUserId,
      mensaje
    };

    const messageId = await MessageModel.create(messageData);

    res.status(201).json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      data: { id: messageId }
    });
  } catch (error) {
    next(error);
  }
};

// Get unread messages count
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await MessageModel.getUnreadCount(userId);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    next(error);
  }
};

// Get broker's visit requests
exports.getBrokerVisitRequests = async (req, res, next) => {
  try {
    const brokerId = req.user.id;
    const filters = {
      estatus: req.query.estatus,
      propiedad_id: req.query.propiedad_id
    };

    const visits = await VisitModel.getByBroker(brokerId, filters);

    res.json({
      success: true,
      data: visits
    });
  } catch (error) {
    next(error);
  }
};

// Update visit request status
exports.updateVisitStatus = async (req, res, next) => {
  try {
    const visitId = req.params.id;
    const brokerId = req.user.id;
    const { estatus, notas_broker } = req.body;

    // Verify ownership
    const visit = await VisitModel.getById(visitId);
    if (!visit || visit.broker_id !== brokerId) {
      throw new AppError('No tienes permiso para actualizar esta solicitud', 403);
    }

    await VisitModel.updateStatus(visitId, estatus, notas_broker);

    res.json({
      success: true,
      message: 'Solicitud de visita actualizada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Get user's visit requests
exports.getUserVisitRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const visits = await VisitModel.getByUser(userId);

    res.json({
      success: true,
      data: visits
    });
  } catch (error) {
    next(error);
  }
};
