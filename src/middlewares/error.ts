import { NextFunction, Request, Response } from "express";
import HttpError from "../interfaces/http-error";
import HttpStatus from "../interfaces/http-status";
import { ValidateError } from "tsoa";

function error(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  }

  if (error instanceof ValidateError) {
    return res.status(error.status).json({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: "Validation error(s).",
      detail: error.fields,
    });
  }

  console.error("Exception Caught:" + error);

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: error.message,
  });
}

export default error;
