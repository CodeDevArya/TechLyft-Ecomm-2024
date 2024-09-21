import express from "express";
import {
  login,
  logout,
  signUp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuthUsers
} from "../controllers/auth.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const app = express.Router();

app.get('/check-auth',verifyToken, checkAuthUsers)

app.post("/sign-up", signUp);

app.post("/login", login);

app.post("/logout", logout);

app.post("/verify-email", verifyEmail);

app.post("/forgot-password", forgotPassword);

app.post("/reset-password/:token", resetPassword);

export default app;
