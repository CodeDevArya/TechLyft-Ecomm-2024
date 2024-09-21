import express from "express";
import {
  addReview,
  deleteReview,
  getAllReviewsWithPagination,
  getUserReviews
} from "../controllers/reviews.js";

const app = express.Router();

app.post("/add-review", addReview);

app.delete("/delete-review/:productId/:reviewId/:userId", deleteReview);

app.get("/all-reviews/:productId", getAllReviewsWithPagination);

app.get("/user-reviews/:productId/:userId", getUserReviews);

export default app;
