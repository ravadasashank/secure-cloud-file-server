/**
 * Global Error Handling Middleware
 * Catches and formats all errors in the application
 */
module.exports = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  
  // Prepare error response
  const errorResponse = {
    message: err.message || 'Internal Server Error',
    status: statusCode
  };

  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};
