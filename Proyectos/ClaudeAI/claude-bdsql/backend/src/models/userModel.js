const { query } = require('../config/database');
const bcrypt = require('bcrypt');

class UserModel {
  // Create user (Broker)
  static async create(userData) {
    // Note: In the real schema, there's no password field in personas table
    // You may need to add a separate authentication table or add password field to personas

    const sql = `
      INSERT INTO personas (
        email, nombre, apellido_paterno, apellido_materno, mobil,
        clasif_persona, prioridad, nota_persona
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      userData.email,
      userData.nombre || userData.nombre_completo,
      userData.apellido_paterno || '',
      userData.apellido_materno || null,
      userData.telefono || userData.mobil || null,
      'Broker',
      userData.prioridad || 'C',
      userData.biografia || userData.nota_persona || null
    ]);

    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM personas WHERE email = ? AND clasif_persona = \'Broker\'';
    const [user] = await query(sql, [email]);
    return user;
  }

  // Find user by ID
  static async findById(id) {
    const sql = `
      SELECT
        p.id_persona as id,
        p.email,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as nombre_completo,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.mobil as telefono,
        p.clasif_persona as rol,
        p.prioridad,
        p.nota_persona as biografia,
        p.created_at as fecha_registro
      FROM personas p
      WHERE p.id_persona = ? AND p.clasif_persona = 'Broker'
    `;
    const [user] = await query(sql, [id]);
    return user;
  }

  // Update user
  static async update(id, userData) {
    const fields = [];
    const params = [];

    // Map old field names to new ones
    const fieldMapping = {
      'nombre_completo': null, // Skip, handled separately
      'telefono': 'mobil',
      'cedula_profesional': null, // Not in schema
      'foto_perfil': null, // Not in schema
      'biografia': 'nota_persona',
      'rol': 'clasif_persona'
    };

    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined && key !== 'password') {
        const dbField = fieldMapping[key];

        if (dbField === null) return; // Skip this field

        if (dbField) {
          fields.push(`${dbField} = ?`);
          params.push(userData[key]);
        } else if (!fieldMapping.hasOwnProperty(key)) {
          fields.push(`${key} = ?`);
          params.push(userData[key]);
        }
      }
    });

    if (fields.length === 0) return;

    params.push(id);
    const sql = `UPDATE personas SET ${fields.join(', ')} WHERE id_persona = ?`;
    return await query(sql, params);
  }

  // Verify password
  // Note: This needs to be implemented with a separate auth table or password field
  static async verifyPassword(plainPassword, hashedPassword) {
    if (!hashedPassword) return false;
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get all brokers
  static async getAllBrokers(filters = {}) {
    let sql = `
      SELECT
        p.id_persona as id,
        p.email,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as nombre_completo,
        p.mobil as telefono,
        p.prioridad,
        p.nota_persona as biografia,
        p.created_at as fecha_registro,
        COUNT(DISTINCT i.id_propiedad) as total_propiedades,
        COUNT(DISTINCT ip.id_interaccion) as total_interacciones
      FROM personas p
      LEFT JOIN inmuebles i ON p.id_persona = i.id_broker_encargado AND i.status_promocion = 'promo_activa'
      LEFT JOIN interacciones_propiedades ip ON i.id_propiedad = ip.id_propiedad
      WHERE p.clasif_persona = 'Broker'
    `;

    const params = [];

    if (filters.search) {
      sql += ' AND (p.nombre LIKE ? OR p.apellido_paterno LIKE ? OR p.email LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' GROUP BY p.id_persona ORDER BY p.nombre, p.apellido_paterno';

    return await query(sql, params);
  }

  // Get broker profile with stats
  static async getBrokerProfile(brokerId) {
    const sql = `
      SELECT
        p.id_persona as id,
        p.email,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as nombre_completo,
        p.mobil as telefono,
        p.prioridad,
        p.nota_persona as biografia,
        p.created_at as fecha_registro,
        COUNT(DISTINCT i.id_propiedad) as total_propiedades,
        COUNT(DISTINCT CASE WHEN i.status_promocion = 'promo_activa' THEN i.id_propiedad END) as propiedades_activas,
        COUNT(DISTINCT ip.id_interaccion) as total_interacciones
      FROM personas p
      LEFT JOIN inmuebles i ON p.id_persona = i.id_broker_encargado
      LEFT JOIN interacciones_propiedades ip ON i.id_propiedad = ip.id_propiedad
      WHERE p.id_persona = ? AND p.clasif_persona = 'Broker'
      GROUP BY p.id_persona
    `;

    const [broker] = await query(sql, [brokerId]);
    return broker;
  }

  // Update last login (would need to add this field to personas or create a separate auth table)
  static async updateLastLogin(userId) {
    // This field doesn't exist in the schema - you may want to add it
    // const sql = 'UPDATE personas SET ultimo_acceso = NOW() WHERE id_persona = ?';
    // return await query(sql, [userId]);
    return true; // Placeholder
  }

  // Deactivate user (no active field in schema - using prioridad or could add status field)
  static async deactivate(userId) {
    const sql = 'UPDATE personas SET prioridad = \'E\' WHERE id_persona = ?';
    return await query(sql, [userId]);
  }

  // Activate user
  static async activate(userId) {
    const sql = 'UPDATE personas SET prioridad = \'A\' WHERE id_persona = ?';
    return await query(sql, [userId]);
  }
}

module.exports = UserModel;
