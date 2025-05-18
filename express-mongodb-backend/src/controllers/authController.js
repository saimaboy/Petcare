const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');

/**
 * @desc    Register a user (both regular users and service providers)
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { 
    name, 
    email, 
    password, 
    phoneNumber, 
    role,
    address,
    licenseNumber,
    serviceType,
    businessName
  } = req.body;

  // Check if user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'Email is already registered'
    });
  }

  // Determine role and validate required fields
  const userRole = role || 'user';
  
  // Validate service provider specific fields
  if ((userRole === 'veterinarian' || userRole === 'pharmacist') && 
      (!licenseNumber || !businessName)) {
    return res.status(400).json({
      success: false,
      error: 'License number and business name are required for service providers'
    });
  }

  // Create user with address information
  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    role: userRole,
    address: {
      street: address?.street || '',
      city: address?.city || '',
      state: address?.state || '',
      zipCode: address?.zipCode || '',
      country: address?.country || 'United States'
    },
    licenseNumber,
    serviceType,
    businessName
  });

  // Log successful registration
  console.log(`New ${userRole} registered: ${name} (${email})`);

  // Send token response
  sendTokenResponse(user, 201, res);
});

/**
 * @desc    Login user
 On December 31st, 2024: * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide an email and password'
    });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Log successful login
  console.log(`User logged in: ${user.name} (${user._id}), role: ${user.role}`);

  // Send token response
  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
      console.log('Token verified successfully, user ID:', decoded.id);
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({
        success: false,
        error: 'Token is invalid or expired'
      });
    }
    
    // Find user by ID
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        businessName: user.businessName,
        licenseNumber: user.licenseNumber,
        serviceType: user.serviceType,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/updateprofile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  // Find the user
  let user = await User.findById(req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Fields that can be updated
  const { 
    name, 
    phoneNumber, 
    businessName, 
    licenseNumber,
    serviceType,
    address 
  } = req.body;

  // Update basic user info
  if (name) user.name = name;
  if (phoneNumber) user.phoneNumber = phoneNumber;

  // Update service provider specific fields
  if (user.role === 'veterinarian' || user.role === 'pharmacist' || user.role === 'service_provider') {
    if (businessName) user.businessName = businessName;
    if (licenseNumber) user.licenseNumber = licenseNumber;
    if (serviceType) user.serviceType = serviceType;
  }

  // Update address
  if (address) {
    user.address = {
      street: address.street || user.address?.street || '',
      city: address.city || user.address?.city || '',
      state: address.state || user.address?.state || '',
      zipCode: address.zipCode || user.address?.zipCode || '',
      country: address.country || user.address?.country || 'United States'
    };
  }

  // Save updated user
  await user.save();

  // Return updated user data
  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      address: user.address,
      businessName: user.businessName,
      licenseNumber: user.licenseNumber,
      serviceType: user.serviceType,
      profileImage: user.profileImage
    }
  });
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'No user with that email'
    });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // For a real app, send email with reset link
  // For now, just return the token
  res.status(200).json({
    success: true,
    message: 'Password reset token generated',
    resetToken
  });
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  await user.save();

  // Log password reset
  console.log(`Password reset for ${user.email}`);

  // Send token response
  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return res.status(401).json({
      success: false,
      error: 'Current password is incorrect'
    });
  }

  // Set new password
  user.password = req.body.newPassword;
  await user.save();

  // Log password update
  console.log(`Password updated for ${user.email}`);

  // Send token response
  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Verify token validity
 * @route   GET /api/auth/verify
 * @access  Public
 */
exports.verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(200).json({
      success: false,
      valid: false,
      message: 'No token provided'
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
    
    // Check if user exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(200).json({
        success: false,
        valid: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      valid: true,
      userId: decoded.id,
      role: user.role
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      valid: false,
      message: 'Invalid token'
    });
  }
});

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token with additional role info
  const token = jwt.sign(
    { 
      id: user._id.toString(),
      role: user.role 
    }, 
    process.env.JWT_SECRET || 'defaultsecret',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  // Send response
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
      businessName: user.businessName,
      serviceType: user.serviceType,
      profileImage: user.profileImage
    }
  });
};