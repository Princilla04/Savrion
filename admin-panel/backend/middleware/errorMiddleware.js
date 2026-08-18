const fs = require('fs');
const path = require('path');

const errorLogPath = path.resolve(__dirname, '../logs/errors.log');

/** Records a structured, non-sensitive API error for operational monitoring. */
const logError = (error, req, statusCode) => {
  fs.mkdirSync(path.dirname(errorLogPath), { recursive: true });
  fs.appendFileSync(errorLogPath, `${JSON.stringify({ timestamp: new Date().toISOString(), statusCode, method: req.method, path: req.originalUrl, message: error.message })}\n`);
};

/** Converts unmatched API routes into the common error format. */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/** Returns a safe API error response and stores the event for monitoring. */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`[API Error] ${req.method} ${req.originalUrl} - ${err.message}`);
  logError(err, req, statusCode);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };
