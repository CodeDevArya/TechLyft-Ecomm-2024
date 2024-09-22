import ErrorHandler from "../utils/utility-classes.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: any,
  next: any
) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  if (err.name === "CastError") err.message = "Invalid ID";

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export const tryCatch =
  (func: ControllerType) =>
  (req: Request, res: Response, next:any) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
