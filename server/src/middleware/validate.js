import { ValidationError } from "../utils/AppError.js";

export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const value = req[source];
    const result = schema.safeParse(value);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return next(new ValidationError(details));
    }

    if (source === "body") {
      req.body = result.data;
    } else {
      req.validated = req.validated ?? {};
      req.validated[source] = result.data;
    }

    next();
  };