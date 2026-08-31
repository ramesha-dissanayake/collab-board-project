import { NotFoundError } from "../utils/AppError.js";

export function notFoundHandler(req, res, next) {
  next(new NotFoundError("Route"));
}

export function errorHandler(err, req, res, next) { 
    void next;
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: {
        message: "Invalid JSON body",
        code: "INVALID_JSON",
      },
    });
  }

  const status = err.status ?? 500;

  const response = {
    error: {
      message:
        status >= 500 ? "Something went wrong" : err.message,
      code: err.code ?? "INTERNAL_ERROR",
    },
  };

  if (err.details) {
    response.error.details = err.details;
  }

  if (status >= 500) {
    console.error(err);
  }

  return res.status(status).json(response);
}