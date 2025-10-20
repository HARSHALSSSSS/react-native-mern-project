const User = require('../models/User');
const { generateToken } = require('../utils/helpers');

/**
 * User Authentication Controller (for mobile app)
 */

// User Registration
exports.userRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    await user.save();

    // Generate token
    const token = generateToken({
      id: user._id,
      email: user.email,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

// User Login
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      id: user._id,
      email: user.email,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User profile fetched successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          city: user.city,
          state: user.state,
          zipCode: user.zipCode,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message,
    });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, address, city, state, zipCode, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        dateOfBirth: dateOfBirth || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        zipCode: zipCode || undefined,
        profileImage: profileImage || undefined,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'User profile updated successfully',
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message,
    });
  }
};

// Update push notification token
exports.updatePushToken = async (req, res) => {
  try {
    const { pushNotificationToken } = req.body;

    if (!pushNotificationToken) {
      return res.status(400).json({
        success: false,
        message: 'Push notification token is required',
      });
    }

    const user = await User.findByIdAndUpdate(req.user.id, { pushNotificationToken }, { new: true });

    res.json({
      success: true,
      message: 'Push token updated successfully',
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating push token',
      error: error.message,
    });
  }
};

module.exports = exports;
