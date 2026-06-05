import * as userService from "../services/userService.js";

export async function register(req, res) {
  const user = await userService.register(req.body);
  res.status(201).json({ data: user });
}

export async function login(req, res) {
  const result = await userService.login(req.body);
  res.json({ data: result });
}

export async function getMe(req, res) {
  const user = await userService.getMe(req.user.id);
  res.json({ data: user });
}
