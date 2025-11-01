const { query } = require('../config/database');

class CatalogoModel {
  /**
   * Get all options for a specific field
   * @param {string} campo - Field name (e.g., 'otros_espacios_resid')
   * @returns {Promise<Array>} Array of options with id, value, and order
   */
  static async getByField(campo) {
    const sql = `
      SELECT id_catalogo, valor_opcion, orden
      FROM catalogos_opciones
      WHERE nombre_campo = ? AND activo = 1
      ORDER BY orden
    `;

    return await query(sql, [campo]);
  }

  /**
   * Get all catalogs grouped by field
   * @returns {Promise<Object>} Object with field names as keys and arrays of values
   */
  static async getAll() {
    const sql = `
      SELECT nombre_campo, valor_opcion, orden
      FROM catalogos_opciones
      WHERE activo = 1
      ORDER BY nombre_campo, orden
    `;

    const results = await query(sql);

    // Group results by field name
    const catalogs = {};

    for (const row of results) {
      if (!catalogs[row.nombre_campo]) {
        catalogs[row.nombre_campo] = [];
      }
      catalogs[row.nombre_campo].push(row.valor_opcion);
    }

    return catalogs;
  }

  /**
   * Create a new catalog option
   * @param {string} campo - Field name
   * @param {string} valor - Option value
   * @param {number} orden - Sort order
   * @returns {Promise<number>} Inserted record ID
   */
  static async create(campo, valor, orden) {
    const sql = `
      INSERT INTO catalogos_opciones (nombre_campo, valor_opcion, orden, activo)
      VALUES (?, ?, ?, 1)
    `;

    const result = await query(sql, [campo, valor, orden]);
    return result.insertId;
  }

  /**
   * Delete a catalog option (soft delete - marks as inactive)
   * @param {number} id - Catalog option ID
   * @returns {Promise<Object>} Query result
   */
  static async delete(id) {
    const sql = `
      UPDATE catalogos_opciones
      SET activo = 0
      WHERE id_catalogo = ?
    `;

    return await query(sql, [id]);
  }
}

module.exports = CatalogoModel;
