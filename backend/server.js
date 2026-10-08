const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env if present
dotenv.config({ path: path.resolve(__dirname, '.env') });

const { connectDB } = require('./config/db');
const { initStore } = require('./services/dataService');
const errorHandler = require('./middleware/errorHandler');

// Route handlers
const departmentRoutes = require('./routes/departmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    hospital: 'WeCare Hospital',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount API routes
app.use('/api/departments', departmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Serve static frontend build if present
const frontendDist = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    res.sendFile(path.resolve(frontendDist, 'index.html'));
  });
} else {
  // 404 handler for API routes if frontend dist is not built
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint '${req.originalUrl}' does not exist on this server.`,
    });
  });
}

// Centralized error handling
app.use(errorHandler);

// Start server and initialize store
const startServer = async () => {
  try {
    await connectDB();
    await initStore();

    app.listen(PORT, () => {
      console.log('==================================================');
      console.log(`🏥 WECARE HOSPITAL API SERVER RUNNING ON PORT ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`🤖 AI Endpoint: http://localhost:${PORT}/api/ai/doctor-recommendation`);
      console.log(`🩺 Doctors API: http://localhost:${PORT}/api/doctors`);
      console.log(`🏢 Departments API: http://localhost:${PORT}/api/departments`);
      console.log(`📅 Appointments API: http://localhost:${PORT}/api/appointments`);
      console.log(`🔒 Admin API: http://localhost:${PORT}/api/admin`);
      console.log('==================================================');
    });
  } catch (error) {
    console.error('Fatal Server Initialization Error:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
