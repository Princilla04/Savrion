require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const { connectDB } = require('./config/db');
const { seedDatabase } = require('./services/seederService');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const technologyRoutes = require('./routes/technologyRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRoutes = require('./routes/contactRoutes');
const contentRoutes = require('./routes/contentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Custom Flexible CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// JSON Response Transformer to automatically convert local upload URLs to HTTPS host URLs
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    if (data && typeof data === 'object') {
      try {
        const host = req.headers.host || 'savrion-website.onrender.com';
        const protocol = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
        const serverBaseUrl = `${protocol}://${host}`;

        let jsonString = JSON.stringify(data);
        if (jsonString.includes('http://localhost:5050/uploads/')) {
          jsonString = jsonString.replaceAll('http://localhost:5050/uploads/', `${serverBaseUrl}/uploads/`);
        }
        data = JSON.parse(jsonString);
      } catch (err) {
        // Fallback to original data if stringify fails
      }
    }
    return originalJson.call(this, data);
  };
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root & Health Check APIs
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Savrion Software Solutions API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      services: '/api/services',
      projects: '/api/projects',
      technologies: '/api/technologies',
      testimonials: '/api/testimonials',
      websiteContent: '/api/website-content'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Savrion Software Solutions API Server',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/website-content', contentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 SAVRION API SERVER RUNNING ON PORT ${PORT}`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start Savrion backend server:', error);
    process.exit(1);
  }
};

startServer();
