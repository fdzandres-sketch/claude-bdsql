const { query } = require('../config/database');

class PropertyModel {
  // Get all properties with filters and pagination
  static async getAll(filters = {}, pagination = {}) {
    const { limit = 10, offset = 0 } = pagination;
    const conditions = [];
    const params = [];

    // Base query
    let sql = `
      SELECT
        i.*,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as broker_nombre,
        p.email as broker_email,
        p.mobil as broker_telefono,
        z.zona as zona_nombre,
        d.nombre_desarrollo as desarrollo_nombre
      FROM inmuebles i
      LEFT JOIN personas p ON i.id_broker_encargado = p.id_persona AND p.clasif_persona = 'Broker'
      LEFT JOIN zonas z ON i.id_zona = z.id_zona
      LEFT JOIN desarrollos d ON i.id_desarrollo = d.id_desarrollo
    `;

    // Always show only active properties for public
    conditions.push('i.status_promocion = ?');
    params.push('promo_activa');

    // Filters
    if (filters.tipo_propiedad) {
      conditions.push('i.tipo_inmueble = ?');
      params.push(filters.tipo_propiedad);
    }

    if (filters.tipo_transaccion) {
      conditions.push('i.tipo_operacion = ?');
      params.push(filters.tipo_transaccion);
    }

    if (filters.zona_id) {
      conditions.push('i.id_zona = ?');
      params.push(filters.zona_id);
    }

    if (filters.desarrollo_id) {
      conditions.push('i.id_desarrollo = ?');
      params.push(filters.desarrollo_id);
    }

    if (filters.precio_min) {
      conditions.push('(i.precio_venta_mn >= ? OR i.precio_renta_mn >= ?)');
      params.push(filters.precio_min, filters.precio_min);
    }

    if (filters.precio_max) {
      conditions.push('(i.precio_venta_mn <= ? OR i.precio_renta_mn <= ?)');
      params.push(filters.precio_max, filters.precio_max);
    }

    if (filters.recamaras) {
      conditions.push('i.recamaras >= ?');
      params.push(filters.recamaras);
    }

    if (filters.banos) {
      conditions.push('i.banos >= ?');
      params.push(filters.banos);
    }

    if (filters.estacionamientos) {
      conditions.push('i.estacionamientos >= ?');
      params.push(filters.estacionamientos);
    }

    if (filters.terreno_min) {
      conditions.push('i.m2_terreno >= ?');
      params.push(filters.terreno_min);
    }

    if (filters.construccion_min) {
      conditions.push('i.medida_construccion >= ?');
      params.push(filters.construccion_min);
    }

    if (filters.search) {
      conditions.push('(i.titulo LIKE ? OR i.descripcion LIKE ? OR z.zona LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Add conditions to query
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Order by
    const orderBy = filters.orden || 'fecha_alta';
    const orderDir = filters.direccion || 'DESC';
    sql += ` ORDER BY i.${orderBy} ${orderDir}`;

    // Pagination
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const properties = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM inmuebles i WHERE i.status_promocion = ?';
    const countParams = ['promo_activa'];

    if (conditions.length > 1) {
      const whereConditions = conditions.slice(1); // Remove first condition (status_promocion)
      countSql += ' AND ' + whereConditions.join(' AND ');
      countParams.push(...params.slice(1, -2)); // Remove status, limit and offset
    }

    const [{ total }] = await query(countSql, countParams);

    return { properties, total };
  }

  // Get property by ID
  static async getById(id) {
    const sql = `
      SELECT
        i.*,
        p.id_persona as broker_id,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as broker_nombre,
        p.email as broker_email,
        p.mobil as broker_telefono,
        z.zona as zona_nombre,
        z.estado,
        z.municipio,
        z.cp as codigo_postal,
        d.nombre_desarrollo as desarrollo_nombre,
        d.amenidades as desarrollo_amenidades
      FROM inmuebles i
      LEFT JOIN personas p ON i.id_broker_encargado = p.id_persona AND p.clasif_persona = 'Broker'
      LEFT JOIN zonas z ON i.id_zona = z.id_zona
      LEFT JOIN desarrollos d ON i.id_desarrollo = d.id_desarrollo
      WHERE i.id_propiedad = ? AND i.status_promocion = 'promo_activa'
    `;

    const [property] = await query(sql, [id]);

    if (property) {
      // Parse JSON fields
      if (property.fotos && typeof property.fotos === 'string') {
        property.imagenes = JSON.parse(property.fotos);
      } else {
        property.imagenes = property.fotos || [];
      }

      if (property.otros_espacios_resid && typeof property.otros_espacios_resid === 'string') {
        property.otros_espacios_resid = JSON.parse(property.otros_espacios_resid);
      }

      if (property.servicios_resid && typeof property.servicios_resid === 'string') {
        property.servicios_resid = JSON.parse(property.servicios_resid);
      }

      if (property.areas_comunes && typeof property.areas_comunes === 'string') {
        property.areas_comunes = JSON.parse(property.areas_comunes);
      }
    }

    return property;
  }

  // Get properties by broker
  static async getByBroker(brokerId, filters = {}) {
    const conditions = ['i.id_broker_encargado = ?'];
    const params = [brokerId];

    let sql = `
      SELECT
        i.*,
        z.zona as zona_nombre,
        d.nombre_desarrollo as desarrollo_nombre,
        (SELECT COUNT(*) FROM interacciones_propiedades WHERE id_propiedad = i.id_propiedad) as total_interacciones
      FROM inmuebles i
      LEFT JOIN zonas z ON i.id_zona = z.id_zona
      LEFT JOIN desarrollos d ON i.id_desarrollo = d.id_desarrollo
    `;

    if (filters.estatus) {
      // Map old status values to new ones
      let statusValue = filters.estatus;
      if (statusValue === 'activo') statusValue = 'promo_activa';
      if (statusValue === 'pausado') statusValue = 'promo_pausada';
      if (statusValue === 'inactivo') statusValue = 'promo_concluida';

      conditions.push('i.status_promocion = ?');
      params.push(statusValue);
    }

    sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY i.fecha_alta DESC';

    return await query(sql, params);
  }

  // Create property
  static async create(propertyData) {
    const sql = `
      INSERT INTO inmuebles (
        id_broker_encargado, tipo_inmueble, tipo_operacion, titulo, descripcion,
        importe_venta, importe_renta, recamaras, banos, medios_banos, estacionamientos,
        medida_terreno, medida_construccion, ano_construccion,
        id_zona, id_desarrollo, calle, no_exterior, no_interior,
        status_promocion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      propertyData.broker_id || propertyData.id_broker_encargado,
      propertyData.tipo_propiedad || propertyData.tipo_inmueble,
      propertyData.tipo_transaccion || propertyData.tipo_operacion,
      propertyData.titulo,
      propertyData.descripcion,
      propertyData.precio || propertyData.importe_venta || null,
      propertyData.importe_renta || null,
      propertyData.recamaras || 0,
      propertyData.banos || 0,
      propertyData.medios_banos || 0,
      propertyData.estacionamientos || 0,
      propertyData.superficie_terreno || propertyData.medida_terreno || null,
      propertyData.superficie_construccion || propertyData.medida_construccion || null,
      propertyData.antiguedad || propertyData.ano_construccion || null,
      propertyData.zona_id || propertyData.id_zona || null,
      propertyData.desarrollo_id || propertyData.id_desarrollo || null,
      propertyData.direccion || propertyData.calle || null,
      propertyData.no_exterior || null,
      propertyData.no_interior || null,
      'promo_activa'
    ];

    const result = await query(sql, params);
    return result.insertId;
  }

  // Update property
  static async update(id, propertyData) {
    const fields = [];
    const params = [];

    // Map old field names to new ones
    const fieldMapping = {
      'broker_id': 'id_broker_encargado',
      'tipo_propiedad': 'tipo_inmueble',
      'tipo_transaccion': 'tipo_operacion',
      'precio': 'importe_venta',
      'superficie_terreno': 'medida_terreno',
      'superficie_construccion': 'medida_construccion',
      'antiguedad': 'ano_construccion',
      'zona_id': 'id_zona',
      'desarrollo_id': 'id_desarrollo',
      'direccion': 'calle',
      'estatus': 'status_promocion'
    };

    Object.keys(propertyData).forEach(key => {
      if (propertyData[key] !== undefined) {
        const dbField = fieldMapping[key] || key;

        // Map status values
        let value = propertyData[key];
        if (key === 'estatus' || key === 'status_promocion') {
          if (value === 'activo') value = 'promo_activa';
          if (value === 'pausado') value = 'promo_pausada';
          if (value === 'inactivo') value = 'promo_concluida';
        }

        fields.push(`${dbField} = ?`);
        params.push(value);
      }
    });

    params.push(id);

    const sql = `UPDATE inmuebles SET ${fields.join(', ')} WHERE id_propiedad = ?`;
    return await query(sql, params);
  }

  // Update property status
  static async updateStatus(id, status) {
    // Map old status values to new ones
    let statusValue = status;
    if (statusValue === 'activo') statusValue = 'promo_activa';
    if (statusValue === 'pausado') statusValue = 'promo_pausada';
    if (statusValue === 'inactivo') statusValue = 'promo_concluida';

    const sql = 'UPDATE inmuebles SET status_promocion = ? WHERE id_propiedad = ?';
    return await query(sql, [statusValue, id]);
  }

  // Clone property
  static async clone(id, brokerId) {
    const property = await this.getById(id);
    if (!property) return null;

    delete property.id_propiedad;
    delete property.fecha_alta;
    delete property.updated_at;
    property.id_broker_encargado = brokerId;
    property.titulo = `${property.titulo} (Copia)`;

    return await this.create(property);
  }

  // Delete property (soft delete - set to inactive)
  static async delete(id) {
    const sql = 'UPDATE inmuebles SET status_promocion = ? WHERE id_propiedad = ?';
    return await query(sql, ['promo_concluida', id]);
  }

  // Add image (update JSON field)
  static async addImage(propertyId, imageData) {
    // Get current property
    const property = await this.getById(propertyId);
    if (!property) return null;

    let fotos = property.imagenes || [];
    fotos.push({
      imagen_url: imageData.imagen_url,
      descripcion: imageData.descripcion || null,
      orden: imageData.orden || fotos.length
    });

    const sql = 'UPDATE inmuebles SET fotos = ? WHERE id_propiedad = ?';
    return await query(sql, [JSON.stringify(fotos), propertyId]);
  }

  // Add amenity to property (update JSON field)
  static async addAmenity(propertyId, amenityId) {
    // Note: In the real schema, amenities might be in otros_espacios_resid or servicios_resid
    // This is a placeholder - adjust based on your actual needs
    return true;
  }

  // Remove amenity from property
  static async removeAmenity(propertyId, amenityId) {
    // Note: In the real schema, amenities might be in otros_espacios_resid or servicios_resid
    // This is a placeholder - adjust based on your actual needs
    return true;
  }
}

module.exports = PropertyModel;
