const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 

require('dotenv').config();

// Log the environment variables to verify they're loaded
console.log('Environment variables:');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set (not shown for security)' : 'Not set');

const UserSchema = new mongoose.Schema({
  // Common fields for all user types
  name: {
    type: String,
    required: [true, 'Please provide name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'veterinarian', 'pharmacist', 'admin', 'service_provider'],
    default: 'user'
  },
  // Add location fields for all users
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'United States'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Fields specific to service providers
  licenseNumber: {
    type: String,
    required: function() {
      return this.role === 'veterinarian' || this.role === 'pharmacist' || this.role === 'service_provider';
    },
    trim: true
  },
  serviceType: {
    type: String,
    enum: ['veterinarian', 'pharmacy', 'other'],
    required: function() {
      return this.role === 'veterinarian' || this.role === 'pharmacist' || this.role === 'service_provider';
    }
  },
  businessName: {
    type: String,
    trim: true
  },
    profileImage: {
    type: String,
    default: null
  },
  // 
  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }
  
  // Generate salt
  const salt = await bcrypt.genSalt(10);
  // Hash password with salt
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'defaultsecretkey',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }  
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);