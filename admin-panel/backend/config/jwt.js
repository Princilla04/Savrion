const jwt = require('jsonwebtoken');

/** Returns the signing secret and rejects unsafe production configuration. */
const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET must be configured in production.');
  return 'development-only-jwt-secret';
};

const generateToken = (id) => {
  const secret = getJwtSecret();
  const expire = process.env.JWT_EXPIRE || '30d';
  return jwt.sign({ id }, secret, { expiresIn: expire });
};

const verifyToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };
