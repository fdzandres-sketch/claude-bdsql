const { query } = require('../config/database');

// NOTE: The 'solicitudes_visita' table doesn't exist in the current schema
// You may need to create this table or use the visitas_busquedas table from the schema

class VisitModel {
  // Create visit request
  static async create(visitData) {
    const sql = `
      INSERT INTO solicitudes_visita (
        propiedad_id, usuario_id, nombre, email, telefono,
        fecha_preferida, hora_preferida, mensaje
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      visitData.propiedad_id,
      visitData.usuario_id || null,
      visitData.nombre,
      visitData.email,
      visitData.telefono,
      visitData.fecha_preferida,
      visitData.hora_preferida || null,
      visitData.mensaje || null
    ]);

    return result.insertId;
  }

  // Get visit requests for broker
  static async getByBroker(brokerId, filters = {}) {
    let sql = `
      SELECT
        sv.*,
        i.titulo as propiedad_titulo,
        i.calle as propiedad_direccion,
        CONCAT(p.nombre, ' ', p.apellido_paterno) as usuario_nombre
      FROM solicitudes_visita sv
      INNER JOIN inmuebles i ON sv.propiedad_id = i.id_propiedad
      LEFT JOIN personas p ON sv.usuario_id = p.id_persona
      WHERE i.id_broker_encargado = ?
    `;

    const params = [brokerId];

    if (filters.estatus) {
      sql += ' AND sv.estatus = ?';
      params.push(filters.estatus);
    }

    if (filters.propiedad_id) {
      sql += ' AND sv.propiedad_id = ?';
      params.push(filters.propiedad_id);
    }

    sql += ' ORDER BY sv.fecha_solicitud DESC';

    return await query(sql, params);
  }

  // Get visit request by ID
  static async getById(id) {
    const sql = `
      SELECT
        sv.*,
        i.titulo as propiedad_titulo,
        i.id_broker_encargado as broker_id,
        CONCAT(p.nombre, ' ', p.apellido_paterno) as usuario_nombre
      FROM solicitudes_visita sv
      INNER JOIN inmuebles i ON sv.propiedad_id = i.id_propiedad
      LEFT JOIN personas p ON sv.usuario_id = p.id_persona
      WHERE sv.id = ?
    `;

    const [visit] = await query(sql, [id]);
    return visit;
  }

  // Update visit status
  static async updateStatus(id, status, notas = null) {
    const sql = `
      UPDATE solicitudes_visita
      SET estatus = ?, notas_broker = ?, fecha_respuesta = NOW()
      WHERE id = ?
    `;

    return await query(sql, [status, notas, id]);
  }

  // Get user visit requests
  static async getByUser(userId) {
    const sql = `
      SELECT
        sv.*,
        i.titulo as propiedad_titulo,
        i.calle as propiedad_direccion,
        CONCAT(p.nombre, ' ', p.apellido_paterno) as broker_nombre,
        p.mobil as broker_telefono,
        p.email as broker_email
      FROM solicitudes_visita sv
      INNER JOIN inmuebles i ON sv.propiedad_id = i.id_propiedad
      INNER JOIN personas p ON i.id_broker_encargado = p.id_persona
      WHERE sv.usuario_id = ?
      ORDER BY sv.fecha_solicitud DESC
    `;

    return await query(sql, [userId]);
  }
}

module.exports = VisitModel;
