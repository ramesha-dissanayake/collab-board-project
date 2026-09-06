import mongoose from "mongoose";

import {
  NotFoundError,
} from "../utils/AppError.js";

export function validateObjectIdParam(
  paramName,
  resourceName = "Resource"
) {
  return function objectIdParamValidator(
    req,
    res,
    next
  ) {
    void res;

    const value =
      req.params[paramName];

    if (
      !mongoose.isValidObjectId(
        value
      )
    ) {
      return next(
        new NotFoundError(
          resourceName
        )
      );
    }

    next();
  };
}