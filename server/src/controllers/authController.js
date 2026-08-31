import * as authService from "../services/authService.js";

export async function register(req, res) {
  const result = await authService.register(req.body);

  if (result.error) {
    return res.status(result.status).json({
      error: {
        message: result.error,
      },
    });
  }

  return res.status(201).json({
    data: result.user,
  });
}

export async function login(req, res) {
  const result = await authService.login(req.body);

  if (result.error) {
    return res.status(result.status).json({
      error: {
        message: result.error,
      },
    });
  }

  return res.status(200).json({
    data: {
      token: result.token,
      user: result.user,
    },
  });
}

export async function me(req, res) {
  const result = await authService.getCurrentUser(req.user.id);

  if (result.error) {
    return res.status(result.status).json({
      error: {
        message: result.error,
      },
    });
  }

  return res.status(200).json({
    data: result.user,
  });
}