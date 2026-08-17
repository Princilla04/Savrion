const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'savrion_super_secure_jwt_secret_key_2026_99a8b7c6d5e4';
  const expire = process.env.JWT_EXPIRE || '30d';
  return jwt.sign({ id }, secret, { expiresIn: expire });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'savrion_super_secure_jwt_secret_key_2026_99a8b7c6d5e4';
  return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };
