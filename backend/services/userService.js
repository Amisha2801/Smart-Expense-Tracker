import bcrypt from "bcrypt";

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
