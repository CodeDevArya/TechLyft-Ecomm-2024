import jwt from "jsonwebtoken";
import { tryCatch } from "./error.js";

export const verifyToken = tryCatch(async (req:any, res:any, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Unauthorized - no token provided" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

  if (!decoded) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - invalid token" });
  }

  (req as unknown as { userId: string }).userId = (
    decoded as { userId: string }
  ).userId;
  next();
});
