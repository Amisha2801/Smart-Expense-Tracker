import * as userService from "../services/userService.js";

export async function register(req, res) {
  const user = await userService.register(req.body);

  res.status(201).json({
    data: user,
  });
}

export async function login(req, res) {
  const result = await userService.login(req.body);

  res.json({
    data: result,
  });
}

export async function getMe(req, res) {
  const user = await userService.getMe(req.user.id);

  res.json({
    data: user,
  });
}

export async function deleteMe(req, res) {
  const { password } = req.body;

  await userService.deleteAccount({
    userId: req.user.id,
    password,
  });

  res.json({
    message: "Your account and all associated data have been deleted.",
  });
}

export async function forgotPassword(req, res) {
  await userService.requestPasswordReset(req.body.email);

  res.json({
    message:
      "If an account exists with that email, a password reset link has been sent.",
  });
}

export async function resetPassword(req, res) {
  const { token, password } = req.body;

  await userService.resetPassword(token, password);

  res.json({
    message: "Password has been reset successfully.",
  });
}