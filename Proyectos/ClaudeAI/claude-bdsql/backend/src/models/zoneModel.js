const { query } = require('../config/database');

class ZoneModel {
  // Get all zones
  static async getAll() {
    const sql = `
      SELECT
        z.*,
        COUNT(i.id_propiedad) as total_propiedades
      FROM zonas z
      LEFT JOIN inmuebles i ON z.id_zona = i.id_zona AND i.status_promocion = 'promo_activa'
      GROUP BY z.id_zona
      ORDER BY z.zona
    `;
    return await query(sql);
  }

  // Get zone by ID
  static async getById(id) {
    const sql = 'SELECT * FROM zonas WHERE id_zona = ?';
    const [zone] = await query(sql, [id]);
    return zone;
  }

  // Create zone
  static async create(zoneData) {
    const sql = `
      INSERT INTO zonas (estado, municipio, cp, zona, ciudad, tipo_zona, nota)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      zoneData.estado,
      zoneData.municipio,
      zoneData.cp || zoneData.codigo_postal,
      zoneData.nombre || zoneData.zona,
      zoneData.ciudad || null,
      zoneData.tipo_zona || 'Urbano',
      zoneData.descripcion || zoneData.nota || null
    ]);
    return result.insertId;
  }

  // Update zone
  static async update(id, zoneData) {
    const fields = [];
    const params = [];

    // Map old field names to new ones
    const fieldMapping = {
      'nombre': 'zona',
      'codigo_postal': 'cp',
      'descripcion': 'nota'
    };

    Object.keys(zoneData).forEach(key => {
      if (zoneData[key] !== undefined) {
        const dbField = fieldMapping[key] || key;
        fields.push(`${dbField} = ?`);
        params.push(zoneData[key]);
      }
    });

    params.push(id);
    const sql = `UPDATE zonas SET ${fields.join(', ')} WHERE id_zona = ?`;
    return await query(sql, params);
  }

  // Delete zone
  static async delete(id) {
    const sql = 'DELETE FROM zonas WHERE id_zona = ?';
    return await query(sql, [id]);
  }
}

module.exports = ZoneModel;
