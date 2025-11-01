const { query } = require('../config/database');

// NOTE: The 'prospectos' table doesn't exist in the current schema
// Consider using the 'personas' table with clasif_persona = 'Prospecto Comprador/Arrendatario'

class ProspectModel {
  // Create prospect
  static async create(prospectData) {
    const sql = `
      INSERT INTO prospectos (
        broker_id, propiedad_id, nombre, email, telefono,
        origen, estatus, notas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      prospectData.broker_id,
      prospectData.propiedad_id || null,
      prospectData.nombre,
      prospectData.email || null,
      prospectData.telefono || null,
      prospectData.origen || 'manual',
      prospectData.estatus || 'nuevo',
      prospectData.notas || null
    ]);

    return result.insertId;
  }

  // Get broker's prospects
  static async getByBroker(brokerId, filters = {}) {
    let sql = `
      SELECT
        pr.*,
        i.titulo as propiedad_titulo,
        i.precio_venta_mn as propiedad_precio,
        COUNT(ip.id_interaccion) as total_interacciones,
        MAX(ip.fecha_interaccion) as ultima_interaccion
      FROM prospectos pr
      LEFT JOIN inmuebles i ON pr.propiedad_id = i.id_propiedad
      LEFT JOIN interacciones_prospecto ip ON pr.id = ip.prospecto_id
      WHERE pr.broker_id = ?
    `;

    const params = [brokerId];

    if (filters.estatus) {
      sql += ' AND pr.estatus = ?';
      params.push(filters.estatus);
    }

    if (filters.propiedad_id) {
      sql += ' AND pr.propiedad_id = ?';
      params.push(filters.propiedad_id);
    }

    if (filters.search) {
      sql += ' AND (pr.nombre LIKE ? OR pr.email LIKE ? OR pr.telefono LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' GROUP BY pr.id ORDER BY pr.fecha_registro DESC';

    return await query(sql, params);
  }

  // Get prospect by ID
  static async getById(id) {
    const sql = `
      SELECT
        pr.*,
        i.titulo as propiedad_titulo,
        i.calle as propiedad_direccion,
        i.precio_venta_mn as propiedad_precio
      FROM prospectos pr
      LEFT JOIN inmuebles i ON pr.propiedad_id = i.id_propiedad
      WHERE pr.id = ?
    `;

    const [prospect] = await query(sql, [id]);
    return prospect;
  }

  // Update prospect
  static async update(id, prospectData) {
    const fields = [];
    const params = [];

    Object.keys(prospectData).forEach(key => {
      if (prospectData[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(prospectData[key]);
      }
    });

    params.push(id);
    const sql = `UPDATE prospectos SET ${fields.join(', ')} WHERE id = ?`;
    return await query(sql, params);
  }

  // Delete prospect
  static async delete(id) {
    const sql = 'DELETE FROM prospectos WHERE id = ?';
    return await query(sql, [id]);
  }

  // Add interaction to prospect
  static async addInteraction(interactionData) {
    const sql = `
      INSERT INTO interacciones_prospecto (
        prospecto_id, tipo, descripcion, fecha_seguimiento
      ) VALUES (?, ?, ?, ?)
    `;

    const result = await query(sql, [
      interactionData.prospecto_id,
      interactionData.tipo,
      interactionData.descripcion || null,
      interactionData.fecha_seguimiento || null
    ]);

    return result.insertId;
  }

  // Get prospect interactions
  static async getInteractions(prospectId) {
    const sql = `
      SELECT * FROM interacciones_prospecto
      WHERE prospecto_id = ?
      ORDER BY fecha DESC
    `;

    return await query(sql, [prospectId]);
  }

  // Get prospect stats by broker
  static async getStatsByBroker(brokerId) {
    const sql = `
      SELECT
        COUNT(*) as total_prospectos,
        COUNT(CASE WHEN estatus = 'nuevo' THEN 1 END) as nuevos,
        COUNT(CASE WHEN estatus = 'contactado' THEN 1 END) as contactados,
        COUNT(CASE WHEN estatus = 'interesado' THEN 1 END) as interesados,
        COUNT(CASE WHEN estatus = 'negociando' THEN 1 END) as negociando,
        COUNT(CASE WHEN estatus = 'cerrado_ganado' THEN 1 END) as cerrados_ganados,
        COUNT(CASE WHEN estatus = 'cerrado_perdido' THEN 1 END) as cerrados_perdidos
      FROM prospectos
      WHERE broker_id = ?
    `;

    const [stats] = await query(sql, [brokerId]);
    return stats;
  }
}

module.exports = ProspectModel;
