// Pagination helper
const paginate = (page = 1, limit = 10) => {
  const offset = (parseInt(page) - 1) * parseInt(limit);
  return {
    limit: parseInt(limit),
    offset: offset
  };
};

// Build pagination response
const paginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total: parseInt(total),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

// Build filter query
const buildFilterQuery = (filters) => {
  const conditions = [];
  const params = [];

  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      conditions.push(`${key} = ?`);
      params.push(filters[key]);
    }
  });

  return {
    where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params
  };
};

// Sanitize user object (remove password)
const sanitizeUser = (user) => {
  const { password, ...sanitized } = user;
  return sanitized;
};

// Generate random code
const generateCode = (length = 6) => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

// Calculate distance between coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

module.exports = {
  paginate,
  paginationResponse,
  buildFilterQuery,
  sanitizeUser,
  generateCode,
  formatCurrency,
  calculateDistance
};
