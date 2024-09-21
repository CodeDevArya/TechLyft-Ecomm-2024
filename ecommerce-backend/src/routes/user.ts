import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  getUserByEmail,
  SendEnquiryMail,
} from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.get("/all-users", adminOnly, getAllUsers);

app.get("/email/:id", getUserByEmail);

app.post("/send-email", SendEnquiryMail);

app.route("/:id").get(getUser).delete(adminOnly, deleteUser);

export default app;
