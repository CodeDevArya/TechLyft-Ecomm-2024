import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  getBarChart,
  getDashboardData,
  getLineChart,
  getPieChart,
} from "../controllers/stats.js";

const app = express.Router();

app.get("/dashboard", adminOnly, getDashboardData)

app.get("/pie", adminOnly, getPieChart);

app.get("/bar", adminOnly, getBarChart); 

app.get("/line", adminOnly, getLineChart);

export default app;
