export function errorHandler(error, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, error);

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500
    ? "Something went wrong while processing your request."
    : error.message;

  res.status(statusCode).json({
    success: false,
    message
  });
}
