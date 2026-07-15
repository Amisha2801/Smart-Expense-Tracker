import { AppError } from "../utils/AppError.js";

export function assertRegisterInput({ email, password, name }) {
  if (!email || !password || !name) {
    throw AppError.badRequest("email, password, and name are required");
  }

  if (password.length < 8) {
    throw AppError.badRequest(
      "Password must be at least 8 characters long"
    );
  }

  if (!/[A-Z]/.test(password)) {
    throw AppError.badRequest(
      "Password must contain at least one uppercase letter"
    );
  }

  if (!/[a-z]/.test(password)) {
    throw AppError.badRequest(
      "Password must contain at least one lowercase letter"
    );
  }

  if (!/[0-9]/.test(password)) {
    throw AppError.badRequest(
      "Password must contain at least one number"
    );
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw AppError.badRequest(
      "Password must contain at least one special character"
    );
  }
}

export function assertLoginInput({ email, password }) {
  if (!email || !password) {
    throw AppError.badRequest("email and password are required");
  }
}

export function assertEmailAvailable(existing) {
  if (existing) {
    throw AppError.badRequest("Email already in use");
  }
}

export function assertUserExists(user) {
  if (!user) {
    throw AppError.notFound("User not found");
  }
}
