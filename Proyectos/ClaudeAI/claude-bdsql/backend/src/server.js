require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const { testConnection } = require('./config/database');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Import routes
const propertyRoutes = require('./routes/propertyRoutes');
const brokerRoutes = require('./routes/brokerRoutes');
const authRoutes = require('./routes/authRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const crmRoutes = require('./routes/crmRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const developmentRoutes = require('./routes/developmentRoutes');
const publicBrokerRoutes = require('./routes/publicBrokerRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));

// Body parser middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Trust proxy (for getting correct IP addresses)
app.set('trust proxy', true);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/properties', propertyRoutes);
app.use('/api/broker', brokerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/developments', developmentRoutes);
app.use('/api/brokers', publicBrokerRoutes);
app.use('/api/catalogos', catalogoRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Inmobiliaria - Backend',
    version: '1.0.0',
    endpoints: {
      properties: '/api/properties',
      zones: '/api/zones',
      developments: '/api/developments',
      brokers: '/api/brokers',
      catalogos: '/api/catalogos',
      broker: '/api/broker',
      auth: '/api/auth',
      communication: '/api/communication',
      crm: '/api/crm',
      tracking: '/api/tracking'
    }
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API URL: http://localhost:${PORT}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer();

module.exports = app;
