const Admin = require('../models/Admin');
const { generateToken } = require('../utils/helpers');

/**
 * Admin Authentication Controller
 */

// Admin Registration
exports.adminRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists',
      });
    }

    // Create new admin
    const admin = new Admin({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: 'admin',
      permissions: ['manage_events', 'manage_categories', 'manage_venues', 'view_bookings'],
    });

    await admin.save();

    // Generate token
    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: admin.role,
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        admin: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering admin',
      error: error.message,
    });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email }).select('+password');
    console.log('Admin found:', admin ? 'Yes' : 'No');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    console.log('Comparing password...');
    let isPasswordCorrect = false;
    try {
      isPasswordCorrect = await admin.comparePassword(password);
    } catch (compareError) {
      console.error('Password comparison error:', compareError);
      return res.status(500).json({
        success: false,
        message: 'Error verifying password',
        error: compareError.message,
      });
    }
    console.log('Password correct:', isPasswordCorrect);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive',
      });
    }

    // Update last login without triggering password hash
    console.log('Updating last login...');
    await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });

    // Generate token
    console.log('Generating token...');
    let token;
    try {
      token = generateToken({
        id: admin._id,
        email: admin.email,
        role: admin.role,
      });
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return res.status(500).json({
        success: false,
        message: 'Error generating token',
        error: tokenError.message,
      });
    }

    console.log('Login successful for:', email);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
          profileImage: admin.profileImage,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    res.json({
      success: true,
      message: 'Admin profile fetched successfully',
      data: {
        admin: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
          profileImage: admin.profileImage,
          isActive: admin.isActive,
          lastLogin: admin.lastLogin,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin profile',
      error: error.message,
    });
  }
};

// Update Admin Profile
exports.updateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, profileImage } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        profileImage: profileImage || undefined,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Admin profile updated successfully',
      data: {
        admin: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phone: admin.phone,
          profileImage: admin.profileImage,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating admin profile',
      error: error.message,
    });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide old password, new password, and confirmation',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match',
      });
    }

    const admin = await Admin.findById(req.admin.id).select('+password');

    // Verify old password
    const isPasswordCorrect = await admin.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect',
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message,
    });
  }
};

module.exports = exports;
