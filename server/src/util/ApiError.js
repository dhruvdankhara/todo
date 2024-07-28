class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.status = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
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
