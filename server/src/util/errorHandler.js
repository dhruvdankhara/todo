class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const handleApiError = (error, res) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "An unexpected error occurred";

  res.status(statusCode).json({
    status: false,
    statusCode,
    message,
    data: {},
  });
};

export { ApiError, handleApiError };
