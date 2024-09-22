import jwt from "jsonwebtoken";
import { tryCatch } from "./error.js";
export const verifyToken = tryCatch(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(400)
            .json({ success: false, message: "Unauthorized - no token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized - invalid token" });
    }
    req.userId = decoded.userId;
    next();
});
