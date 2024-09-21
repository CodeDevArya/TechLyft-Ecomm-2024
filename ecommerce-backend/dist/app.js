import express from "express";
import connectDB from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";
import cookieParser from "cookie-parser";
// Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/orders.js";
import PaymentRoute from "./routes/payment.js";
import StatsRoute from "./routes/stats.js";
import authRoute from "./routes/auth.js";
import reviewsRoute from "./routes/reviews.js";
import path from "path";
// load environment variables from.env file
config({
    path: "./.env",
});
// define port number
const port = process.env.PORT || 3000;
const __dirname = path.resolve();
//connect to MongoDB database
const MONGODB_URI = process.env.MONGODB_URI || "";
connectDB(MONGODB_URI);
//payment gateway
const STRIPE_KEY = process.env.STRIPE_KEY || "";
export const stripe = new Stripe(STRIPE_KEY);
//cache setup
export const myCache = new NodeCache();
const app = express();
app.use(express.json());
app.use(cookieParser()); // parse cookies from request headers
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
//Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/review", reviewsRoute);
app.use("/api/v1/payment", PaymentRoute);
app.use("/api/v1/admin-panel/stats", StatsRoute);
// middleware
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
//
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}
app.listen(port, () => {
    console.log(`Server is running on  http://localhost:${port}`);
});
