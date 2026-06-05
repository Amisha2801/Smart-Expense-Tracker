export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }

  static badRequest(message) {
    return new AppError(message, 400);
  }

  static notFound(message = "Resource not found") {
    return new AppError(message, 404);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, 401);
  }
}
