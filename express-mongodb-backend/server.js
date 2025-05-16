require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

// Config variables
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGODB_URI || 'mongodb+srv://malindakawshalya:mkk123@pet.70rojzs.mongodb.net/petcare?retryWrites=true&w=majority';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URI, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
const startServer = async () => {
  await connectDB();
  
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

// Initialize server
startServer();