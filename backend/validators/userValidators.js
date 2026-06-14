import { AppError } from "../utils/AppError.js";

export function assertRegisterInput({ email, password, name }) {
  if (!email || !password || !name) {
    throw AppError.badRequest("email, password, and name are required");
  }

  if (password.length < 6) {
    throw AppError.badRequest(
      "Password must be at least 6 characters long"
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
