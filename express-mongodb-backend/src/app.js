const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');
const errorHandler = require('./middleware/error');
const productRoutes = require('./routes/productRoutes');
const articleRoutes = require('./routes/articleRoutes');

// Initialize app FIRST
const app = express();

// Middleware
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware in development
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const vetRoutes = require('./routes/vetRoutes');
const authRoutes = require('./routes/auth');
const veterinarianRoutes = require('./routes/vetRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const orders = require("./routes/orders");

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/prescriptions', prescriptionRoutes);  
app.use('/api/vets', vetRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/veterinarians', veterinarianRoutes);
app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/appointments', appointmentRoutes);
app.use("/api/orders", orders);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found` 
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;