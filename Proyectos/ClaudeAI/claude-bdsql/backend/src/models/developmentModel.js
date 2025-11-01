const { query } = require('../config/database');

class DevelopmentModel {
  // Get all developments
  static async getAll() {
    const sql = `
      SELECT
        d.*,
        z.zona as zona_nombre,
        COUNT(i.id_propiedad) as total_propiedades
      FROM desarrollos d
      LEFT JOIN zonas z ON d.id_zona = z.id_zona
      LEFT JOIN inmuebles i ON d.id_desarrollo = i.id_desarrollo AND i.status_promocion = 'promo_activa'
      GROUP BY d.id_desarrollo
      ORDER BY d.nombre_desarrollo
    `;
    return await query(sql);
  }

  // Get development by ID
  static async getById(id) {
    const sql = `
      SELECT
        d.*,
        z.zona as zona_nombre,
        z.estado,
        z.municipio
      FROM desarrollos d
      LEFT JOIN zonas z ON d.id_zona = z.id_zona
      WHERE d.id_desarrollo = ?
    `;
    const [development] = await query(sql, [id]);

    if (development) {
      // Parse amenidades JSON if exists
      if (development.amenidades && typeof development.amenidades === 'string') {
        development.amenidades = JSON.parse(development.amenidades);
      }
    }

    return development;
  }

  // Create development
  static async create(devData) {
    const sql = `
      INSERT INTO desarrollos (
        nombre_desarrollo, id_zona, tipo_desarrollo, calif_desarrollo,
        amenidades, nota
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Convert amenidades array to JSON
    const amenidadesJSON = devData.amenidades ? JSON.stringify(devData.amenidades) : null;

    const result = await query(sql, [
      devData.nombre || devData.nombre_desarrollo,
      devData.zona_id || devData.id_zona || null,
      devData.tipo_desarrollo || 'Fraccionamiento privado',
      devData.calif_desarrollo || null,
      amenidadesJSON,
      devData.descripcion || devData.nota || null
    ]);

    return result.insertId;
  }

  // Update development
  static async update(id, devData) {
    const fields = [];
    const params = [];

    // Map old field names to new ones
    const fieldMapping = {
      'nombre': 'nombre_desarrollo',
      'zona_id': 'id_zona',
      'descripcion': 'nota'
    };

    Object.keys(devData).forEach(key => {
      if (devData[key] !== undefined) {
        const dbField = fieldMapping[key] || key;

        let value = devData[key];

        // Convert amenidades array to JSON
        if (key === 'amenidades' && Array.isArray(value)) {
          value = JSON.stringify(value);
        }

        fields.push(`${dbField} = ?`);
        params.push(value);
      }
    });

    params.push(id);
    const sql = `UPDATE desarrollos SET ${fields.join(', ')} WHERE id_desarrollo = ?`;
    return await query(sql, params);
  }

  // Delete development
  static async delete(id) {
    const sql = 'DELETE FROM desarrollos WHERE id_desarrollo = ?';
    return await query(sql, [id]);
  }

  // Add amenity to development (update JSON field)
  static async addAmenity(developmentId, amenityName) {
    const development = await this.getById(developmentId);
    if (!development) return null;

    let amenidades = development.amenidades || [];
    if (!amenidades.includes(amenityName)) {
      amenidades.push(amenityName);
    }

    const sql = 'UPDATE desarrollos SET amenidades = ? WHERE id_desarrollo = ?';
    return await query(sql, [JSON.stringify(amenidades), developmentId]);
  }

  // Remove amenity from development (update JSON field)
  static async removeAmenity(developmentId, amenityName) {
    const development = await this.getById(developmentId);
    if (!development) return null;

    let amenidades = development.amenidades || [];
    amenidades = amenidades.filter(a => a !== amenityName);

    const sql = 'UPDATE desarrollos SET amenidades = ? WHERE id_desarrollo = ?';
    return await query(sql, [JSON.stringify(amenidades), developmentId]);
  }
}

module.exports = DevelopmentModel;
