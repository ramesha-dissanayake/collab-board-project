import {
  NotFoundError,
} from "../utils/AppError.js";

export function notFoundHandler(
  req,
  res,
  next
) {
  void req;
  void res;

  next(
    new NotFoundError(
      "Route"
    )
  );
}

function mongooseValidationDetails(
  error
) {
  return Object.values(
    error.errors ?? {}
  ).map(
    (item) => ({
      field:
        item.path ??
        "unknown",

      message:
        item.message ??
        "Invalid value",
    })
  );
}

export function errorHandler(
  err,
  req,
  res,
  next
) {
  void req;
  void next;

  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res
      .status(400)
      .json({
        error: {
          message:
            "Invalid JSON body",

          code:
            "INVALID_JSON",
        },
      });
  }

  if (
    err?.name ===
    "ValidationError"
  ) {
    return res
      .status(400)
      .json({
        error: {
          message:
            "Database validation failed",

          code:
            "DATABASE_VALIDATION_ERROR",

          details:
            mongooseValidationDetails(
              err
            ),
        },
      });
  }

  if (
    err?.name ===
    "CastError"
  ) {
    return res
      .status(404)
      .json({
        error: {
          message:
            "Resource not found",

          code:
            "NOT_FOUND",
        },
      });
  }

  if (
    err?.code === 11000
  ) {
    const fields =
      Object.keys(
        err.keyPattern ??
        err.keyValue ??
        {}
      );

    return res
      .status(409)
      .json({
        error: {
          message:
            "A resource with that value already exists",

          code:
            "DUPLICATE_KEY",

          details: {
            fields,
          },
        },
      });
  }

  const status =
    err.status ??
    500;

  const response = {
    error: {
      message:
        status >= 500
          ? "Something went wrong"
          : err.message,

      code:
        err.code ??
        "INTERNAL_ERROR",
    },
  };

  if (
    err.details
  ) {
    response.error.details =
      err.details;
  }

  if (
    status >= 500
  ) {
    console.error(
      err
    );
  }

  return res
    .status(status)
    .json(response);
}