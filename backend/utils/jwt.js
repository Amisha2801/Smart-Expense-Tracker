import jwt from "jsonwebtoken";

import { AppError } from "./AppError.js";

export function signToken({ sub, name, email }) {
  return jwt.sign(
    {
      sub,
      name,
      email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

export function verifyToken(token) {
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
    };
  } catch {
    throw AppError.unauthorized(
      "Invalid or expired token"
    );
  }
}
