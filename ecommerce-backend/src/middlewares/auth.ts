import { tryCatch } from "./error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-classes.js";

//middleware to male sure only admin can access this route
export const adminOnly = tryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new ErrorHandler("User must be Logged In", 401));
  }

  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.role !== "admin") return next(new ErrorHandler("Unauthorized, Only Admin can access this route", 401));

  next();
});
