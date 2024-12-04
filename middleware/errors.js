const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Copy error object to modify it safely
  let error = { ...err };
  error.message = err.message || "Server Error";

  // Specific Error Handling
  if (err.name === "CastError") {
    error = new ErrorHandler(
      `Resource not found with id ${err.value}. Invalid ${err.path}`,
      404
    );
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ErrorHandler(message, 400);
  }

  // Duplicate Key Error Handling (E11000)
  if (err.code === 11000) {
    // console.log("Duplicate Key Error Detected:"); // Log the duplicate key error for debugging
    const field = Object.keys(err.keyValue)[0]; // Get the field causing the issue
    const value = err.keyValue[field]; // Get the duplicate value
    const message = `Duplicate value '${value}' for field '${field}'. Please use another value.`;
    error = new ErrorHandler(message, 400); // Modify the error to send the custom message
  }

  if (err.name === "JsonWebTokenError") {
    error = new ErrorHandler("Invalid Token. Please try again!", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new ErrorHandler("You were logged out. Please login again!", 401);
  }

  // Development Mode
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    // console.log("Final error object:", error); // Add this to debug the error object

    // console.error("Error Details:", err); // Log full error for debugging
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "An error occurred.",
      error: err,
      stack: err.stack,
    });
  }

  // Production Mode
  if (process.env.NODE_ENV === "PRODUCTION") {
    // console.error("Error Details (Production):", err);  // Log errors in production as well

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
