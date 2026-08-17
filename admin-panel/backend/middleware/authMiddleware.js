const { verifyToken } = require('../config/jwt');
const Admin = require('../models/Admin');
const datastore = require('../services/datastore');
const { getIsFallbackMode } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.'
    });
  }

  try {
    const decoded = verifyToken(token);
    let adminUser = null;

    if (getIsFallbackMode()) {
      adminUser = await datastore.findById('admins', decoded.id);
      if (adminUser) {
        delete adminUser.password;
      }
    } else {
      adminUser = await Admin.findById(decoded.id).select('-password');
    }

    if (!adminUser) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.admin = adminUser;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token. Please log in again.'
    });
  }
};

module.exports = { protect };
