const { query } = require('../config/database');

class InteractionModel {
  // Create interaction
  static async create(interactionData) {
    const sql = `
      INSERT INTO interacciones_propiedades (
        id_propiedad, id_broker_dueno, id_persona_visitante, id_sesion,
        tipo_interaccion, tiempo_visualizacion, datos_adicionales
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Convert detalles to JSON for datos_adicionales
    const datosAdicionales = interactionData.detalles ? JSON.stringify(interactionData.detalles) : null;

    const result = await query(sql, [
      interactionData.propiedad_id || interactionData.id_propiedad,
      interactionData.broker_id || interactionData.id_broker_dueno,
      interactionData.usuario_id || interactionData.id_persona_visitante || null,
      interactionData.id_sesion || null,
      interactionData.tipo || interactionData.tipo_interaccion || 'vista',
      interactionData.tiempo_visualizacion || null,
      datosAdicionales
    ]);

    return result.insertId;
  }

  // Get interactions by property
  static async getByProperty(propertyId, filters = {}) {
    let sql = `
      SELECT
        ip.*,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as usuario_nombre,
        p.email as usuario_email
      FROM interacciones_propiedades ip
      LEFT JOIN personas p ON ip.id_persona_visitante = p.id_persona
      WHERE ip.id_propiedad = ?
    `;

    const params = [propertyId];

    if (filters.tipo) {
      sql += ' AND ip.tipo_interaccion = ?';
      params.push(filters.tipo);
    }

    if (filters.fecha_desde) {
      sql += ' AND ip.fecha_interaccion >= ?';
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      sql += ' AND ip.fecha_interaccion <= ?';
      params.push(filters.fecha_hasta);
    }

    sql += ' ORDER BY ip.fecha_interaccion DESC';

    return await query(sql, params);
  }

  // Get interactions by broker (all properties)
  static async getByBroker(brokerId, filters = {}) {
    let sql = `
      SELECT
        ip.*,
        i.titulo as propiedad_titulo,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as usuario_nombre,
        p.email as usuario_email
      FROM interacciones_propiedades ip
      INNER JOIN inmuebles i ON ip.id_propiedad = i.id_propiedad
      LEFT JOIN personas p ON ip.id_persona_visitante = p.id_persona
      WHERE ip.id_broker_dueno = ?
    `;

    const params = [brokerId];

    if (filters.tipo) {
      sql += ' AND ip.tipo_interaccion = ?';
      params.push(filters.tipo);
    }

    if (filters.propiedad_id) {
      sql += ' AND ip.id_propiedad = ?';
      params.push(filters.propiedad_id);
    }

    if (filters.fecha_desde) {
      sql += ' AND ip.fecha_interaccion >= ?';
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      sql += ' AND ip.fecha_interaccion <= ?';
      params.push(filters.fecha_hasta);
    }

    sql += ' ORDER BY ip.fecha_interaccion DESC LIMIT 100';

    return await query(sql, params);
  }

  // Get stats by property
  static async getStatsByProperty(propertyId) {
    const sql = `
      SELECT
        COUNT(*) as total_interacciones,
        COUNT(CASE WHEN tipo_interaccion = 'vista' THEN 1 END) as vistas,
        COUNT(CASE WHEN tipo_interaccion = 'mensaje' THEN 1 END) as contactos,
        COUNT(CASE WHEN tipo_interaccion = 'llamada' THEN 1 END) as solicitudes_visita,
        COUNT(CASE WHEN tipo_interaccion = 'guardar_favorito' THEN 1 END) as favoritos,
        COUNT(CASE WHEN tipo_interaccion = 'compartir' THEN 1 END) as compartidos,
        COUNT(CASE WHEN tipo_interaccion = 'whatsapp' THEN 1 END) as whatsapps,
        COUNT(DISTINCT id_persona_visitante) as usuarios_unicos,
        COUNT(DISTINCT DATE(fecha_interaccion)) as dias_con_actividad
      FROM interacciones_propiedades
      WHERE id_propiedad = ?
    `;

    const [stats] = await query(sql, [propertyId]);
    return stats;
  }

  // Get stats by broker
  static async getStatsByBroker(brokerId, filters = {}) {
    let sql = `
      SELECT
        COUNT(DISTINCT ip.id_interaccion) as total_interacciones,
        COUNT(CASE WHEN ip.tipo_interaccion = 'vista' THEN 1 END) as vistas,
        COUNT(CASE WHEN ip.tipo_interaccion = 'mensaje' THEN 1 END) as contactos,
        COUNT(CASE WHEN ip.tipo_interaccion = 'llamada' THEN 1 END) as solicitudes_visita,
        COUNT(CASE WHEN ip.tipo_interaccion = 'guardar_favorito' THEN 1 END) as favoritos,
        COUNT(DISTINCT ip.id_persona_visitante) as usuarios_unicos,
        COUNT(DISTINCT ip.id_propiedad) as propiedades_con_actividad
      FROM interacciones_propiedades ip
      INNER JOIN inmuebles i ON ip.id_propiedad = i.id_propiedad
      WHERE ip.id_broker_dueno = ?
    `;

    const params = [brokerId];

    if (filters.fecha_desde) {
      sql += ' AND ip.fecha_interaccion >= ?';
      params.push(filters.fecha_desde);
    }

    if (filters.fecha_hasta) {
      sql += ' AND ip.fecha_interaccion <= ?';
      params.push(filters.fecha_hasta);
    }

    const [stats] = await query(sql, params);
    return stats;
  }

  // Increment property view count
  static async incrementPropertyViews(propertyId) {
    const sql = 'UPDATE inmuebles SET vistas = vistas + 1 WHERE id_propiedad = ?';
    return await query(sql, [propertyId]);
  }
}

module.exports = InteractionModel;
