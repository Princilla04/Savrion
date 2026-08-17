const Admin = require('../models/Admin');
const { generateToken } = require('../config/jwt');
const { getIsFallbackMode } = require('../config/db');
const datastore = require('../services/datastore');
const bcrypt = require('bcryptjs');

// @desc    Admin login & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    let admin = null;
    let isMatch = false;

    if (getIsFallbackMode()) {
      admin = await datastore.findOne('admins', { email: email.toLowerCase().trim() });
      if (admin) {
        isMatch = await bcrypt.compare(password, admin.password);
      }
    } else {
      admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');
      if (admin) {
        isMatch = await admin.matchPassword(password);
      }
    }

    if (!admin || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(admin._id || admin.id);

    // Update last login
    const updatedLogin = new Date();
    if (getIsFallbackMode()) {
      await datastore.findByIdAndUpdate('admins', admin._id || admin.id, { lastLogin: updatedLogin });
    } else {
      admin.lastLogin = updatedLogin;
      await admin.save();
    }

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id || admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: updatedLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.admin
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const adminId = req.admin._id || req.admin.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase().trim();
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    let updated = null;
    if (getIsFallbackMode()) {
      updated = await datastore.findByIdAndUpdate('admins', adminId, updateData);
      delete updated.password;
    } else {
      if (password) {
        const admin = await Admin.findById(adminId);
        if (name) admin.name = name;
        if (email) admin.email = email.toLowerCase().trim();
        admin.password = password;
        await admin.save();
        updated = admin;
      } else {
        updated = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      admin: {
        id: updated._id || updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe, updateProfile };
