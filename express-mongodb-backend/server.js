const express = require('express');
const mongoose = require('mongoose');
const config = require('./src/config/config');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

mongoose.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });