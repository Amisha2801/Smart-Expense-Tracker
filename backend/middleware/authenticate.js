import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";

export function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      throw AppError.unauthorized("Missing or invalid token");
    }

    const token = header.slice(7);
    req.user = verifyToken(token);
    next();
  } catch (err) {
    next(err);
  }
}
