const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');
const errorMiddleware = require('./middleware/error');

// Route imports
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const vetRoutes = require('./routes/vetRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware in development
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Pet Care API is running' });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/vets', vetRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found` 
  });
});

// Error handling middleware
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await mongoose.connect(config.DB_URI);
    console.log('Connected to MongoDB');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running in ${config.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Start server
if (require.main === module) {
  startServer();
}

module.exports = app; 