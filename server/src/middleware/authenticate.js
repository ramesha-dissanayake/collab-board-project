import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: {
        message: "Authentication required",
        code: "NO_TOKEN",
      },
    });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    return next();
  } catch (error) {
    const expired = error.name === "TokenExpiredError";

    return res.status(401).json({
      error: {
        message: expired ? "Token expired" : "Invalid token",
        code: expired ? "TOKEN_EXPIRED" : "BAD_TOKEN",
      },
    });
  }
}