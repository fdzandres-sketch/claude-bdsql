const { query } = require('../config/database');

// NOTE: The 'mensajes' table doesn't exist in the current schema
// You may need to create this table or adapt to use existing tables

class MessageModel {
  // Create message
  static async create(messageData) {
    const sql = `
      INSERT INTO mensajes (
        propiedad_id, remitente_id, destinatario_id, mensaje
      ) VALUES (?, ?, ?, ?)
    `;

    const result = await query(sql, [
      messageData.propiedad_id,
      messageData.remitente_id || null,
      messageData.destinatario_id,
      messageData.mensaje
    ]);

    return result.insertId;
  }

  // Get messages for a conversation
  static async getConversation(propertyId, userId, brokerId) {
    const sql = `
      SELECT
        m.*,
        CONCAT(p1.nombre, ' ', p1.apellido_paterno) as remitente_nombre,
        CONCAT(p2.nombre, ' ', p2.apellido_paterno) as destinatario_nombre
      FROM mensajes m
      LEFT JOIN personas p1 ON m.remitente_id = p1.id_persona
      LEFT JOIN personas p2 ON m.destinatario_id = p2.id_persona
      WHERE m.propiedad_id = ?
        AND ((m.remitente_id = ? AND m.destinatario_id = ?)
          OR (m.remitente_id = ? AND m.destinatario_id = ?))
      ORDER BY m.fecha_envio ASC
    `;

    return await query(sql, [propertyId, userId, brokerId, brokerId, userId]);
  }

  // Get all conversations for a user
  static async getUserConversations(userId) {
    const sql = `
      SELECT
        m.propiedad_id,
        i.titulo as propiedad_titulo,
        CASE
          WHEN m.remitente_id = ? THEN m.destinatario_id
          ELSE m.remitente_id
        END as otro_usuario_id,
        CASE
          WHEN m.remitente_id = ? THEN CONCAT(p2.nombre, ' ', p2.apellido_paterno)
          ELSE CONCAT(p1.nombre, ' ', p1.apellido_paterno)
        END as otro_usuario_nombre,
        MAX(m.fecha_envio) as ultimo_mensaje_fecha,
        COUNT(CASE WHEN m.destinatario_id = ? AND m.leido = 0 THEN 1 END) as mensajes_no_leidos
      FROM mensajes m
      LEFT JOIN inmuebles i ON m.propiedad_id = i.id_propiedad
      LEFT JOIN personas p1 ON m.remitente_id = p1.id_persona
      LEFT JOIN personas p2 ON m.destinatario_id = p2.id_persona
      WHERE m.remitente_id = ? OR m.destinatario_id = ?
      GROUP BY m.propiedad_id, otro_usuario_id
      ORDER BY ultimo_mensaje_fecha DESC
    `;

    return await query(sql, [userId, userId, userId, userId, userId]);
  }

  // Mark messages as read
  static async markAsRead(propertyId, userId, brokerId) {
    const sql = `
      UPDATE mensajes
      SET leido = 1, fecha_lectura = NOW()
      WHERE propiedad_id = ?
        AND destinatario_id = ?
        AND remitente_id = ?
        AND leido = 0
    `;

    return await query(sql, [propertyId, userId, brokerId]);
  }

  // Get unread count
  static async getUnreadCount(userId) {
    const sql = `
      SELECT COUNT(*) as total
      FROM mensajes
      WHERE destinatario_id = ? AND leido = 0
    `;

    const [result] = await query(sql, [userId]);
    return result.total;
  }
}

module.exports = MessageModel;
