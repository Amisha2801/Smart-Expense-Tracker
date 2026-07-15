import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendPasswordResetEmail } from "./emailService.js";

import { AppError } from "../utils/AppError.js";
import { signToken } from "../utils/jwt.js";
import {
  assertEmailAvailable,
  assertLoginInput,
  assertRegisterInput,
  assertUserExists,
} from "../validators/userValidators.js";
import * as userRepository from "../repositories/userRepository.js";

export async function register({ email, password, name }) {
  assertRegisterInput({ email, password, name });

  const existing = await userRepository.findByEmail(email);
  assertEmailAvailable(existing);

  const passwordHash = await bcrypt.hash(password, 10);

  return userRepository.create({
    email,
    passwordHash,
    name,
  });
}

export async function login({ email, password }) {
  assertLoginInput({ email, password });

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw AppError.badRequest("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    throw AppError.badRequest("Invalid credentials");
  }

  const safeUser = { id: user.id, email: user.email, name: user.name };
  const token = signToken({ sub: user.id, email: user.email });

  return { user: safeUser, token };
}

export async function getMe(userId) {
  const user = await userRepository.findById(userId);
  assertUserExists(user);

  return { id: user.id, email: user.email, name: user.name };
}

export async function requestPasswordReset(email) {
  if (!email) {
    throw AppError.badRequest("Email is required");
  }

  const user = await userRepository.findByEmail(email);

  // Return the same response even if the email does not exist.
  // This prevents people from checking which emails are registered.
  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await userRepository.createPasswordResetToken({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  const resetLink =
    `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendPasswordResetEmail({
    to: user.email,
    resetLink,
  });
}

export async function resetPassword(token, newPassword) {
  if (!token || !newPassword) {
    throw AppError.badRequest("Token and new password are required");
  }

  assertRegisterInput({
    email: "reset@example.com",
    password: newPassword,
    name: "Reset User",
  });

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const resetRecord = await userRepository.findPasswordResetToken(tokenHash);

  if (!resetRecord) {
    throw AppError.badRequest("Reset link is invalid or has expired.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await userRepository.updatePassword(
    resetRecord.user_id,
    passwordHash
  );

  await userRepository.markPasswordResetTokenUsed(resetRecord.id);
}