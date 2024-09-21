import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  allOrders,
  deleteOrder,
  getOrderDetailsById,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/orders.js";

const app = express.Router();

app.get("/my-orders", myOrders);

app.get("/all-orders", adminOnly, allOrders);

app.post("/new", newOrder);

app
  .route("/:id")
  .get(getOrderDetailsById)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default app;
