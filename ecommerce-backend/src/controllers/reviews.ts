import { Request, Response, NextFunction } from "express";
import { tryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-classes.js";
import { Reviews } from "../models/reviews.js";
import { Product } from "../models/products.js";
import { invalidateCache } from "../utils/features.js";

// Define the type for the request body
interface ReviewRequestBody {
  productId: string;
  title: string;
  text: string;
  rating: number;
  name: string;
  userId: string;
}

export const addReview = tryCatch(
  async (
    req: any, res: any, next: any
  ) => {
    const { productId, title, text, rating, name, userId } = req.body;

    if (!productId || !title || !text || !rating || !name || !userId) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Check if the product exists
    const ChangeProduct = await Product.findById(productId);

    if (!ChangeProduct) {
      return next(
        new ErrorHandler(`No product found with ID ${productId}`, 404)
      );
    }

    // Check if a review exists for the given productId
    let existingReview = await Reviews.findOne({ productId: productId });

    if (existingReview) {
      // If the review exists, add the new review to the existing list
      existingReview.reviewsList.push({
        userId,
        title,
        text,
        rating,
        name,
        reviewDate: new Date(), // Default to current date
      });
      await existingReview.save();
    } else {
      // If no review exists, create a new document
      existingReview = new Reviews({
        productId,
        reviewsList: [
          {
            userId,
            title,
            text,
            rating,
            name,
            reviewDate: new Date(), // Default to current date
          },
        ],
      });
      await existingReview.save();
    }

    // Update product review count
    ChangeProduct.totalReviews += 1;

    // Calculate the average rating
    const allReviews = existingReview.reviewsList;
    const totalRatings = allReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    ChangeProduct.rating = totalRatings / allReviews.length;

    // Save updated product
    await ChangeProduct.save();

    invalidateCache({ product: true, admin: true, productId });

    return res.status(201).json({
      success: true,
      message: `Review added successfully.`,
    });
  }
);

export const getAllReviewsWithPagination = tryCatch(
  async (req: any, res: any, next: any) => {
    const { productId } = req.params;
    const limit = 6; // Max 6 reviews per page
    const page = parseInt(req.query.page as string) || 1; // Get the page number from the query, default to page 1

    if (!productId) {
      return next(new ErrorHandler("Product ID is required", 400));
    }

    // Fetch the reviews based on productId
    const productReviews = await Reviews.findOne({ productId });

    if (!productReviews) {
      return next(
        new ErrorHandler(
          `No reviews found for product with ID ${productId}`,
          404
        )
      );
    }

    // Sort reviews by reviewDate in descending order (newest first)
    const sortedReviews = productReviews.reviewsList.sort(
      (a, b) => b.reviewDate.getTime() - a.reviewDate.getTime()
    );

    // Total number of reviews for the product
    const totalReviews = sortedReviews.length;

    // Calculate total number of pages
    const totalPages = Math.ceil(totalReviews / limit);

    // Ensure page is within valid range
    if (page > totalPages) {
      return next(new ErrorHandler(`Page ${page} does not exist`, 404));
    }

    // Get the reviews for the current page
    const start = (page - 1) * limit;
    const paginatedReviews = sortedReviews.slice(start, start + limit);

    return res.status(200).json({
      success: true,
      reviews: paginatedReviews,
      currentPage: page,
      totalPages,
      totalReviews,
    });
  }
);

export const deleteReview = tryCatch(
  async (req: any, res: any, next: any) => {
    const { productId, reviewId, userId } = req.params;

    if (!userId) {
      return next(new ErrorHandler("User ID is required", 400));
    }

    const ChangeProduct = await Product.findById(productId);

    if (!ChangeProduct) {
      return next(
        new ErrorHandler(`No product found with ID ${productId}`, 404)
      );
    }

    // Fetch the product reviews
    const productReviews = await Reviews.findOne({ productId });

    if (!productReviews) {
      return next(
        new ErrorHandler(
          `No reviews found for product with ID ${productId}`,
          404
        )
      );
    }

    // Find the review to delete
    const review = productReviews.reviewsList.id(reviewId);

    if (!review) {
      return next(new ErrorHandler(`No review found with ID ${reviewId}`, 404));
    }

    // Check if the userId matches the review's userId
    if (review.userId !== userId) {
      return next(
        new ErrorHandler("You are not authorized to delete this review", 403)
      );
    }

    // Remove the review from the list
    productReviews.reviewsList.pull(reviewId);

    await productReviews.save();

    // Update the total number of reviews
    const totalReviews = productReviews.reviewsList.length;
    ChangeProduct.totalReviews = totalReviews;

    // Recalculate the average rating if there are remaining reviews
    if (totalReviews > 0) {
      const totalRatings = productReviews.reviewsList.reduce(
        (sum, rev) => sum + rev.rating,
        0
      );
      ChangeProduct.rating = Math.max(
        1,
        Math.min(5, totalRatings / totalReviews)
      ); // Ensure rating is within 1 to 5
    } else {
      // No reviews left, set rating to 0 or some default value
      ChangeProduct.rating = 0;
    }

    // Save the updated product
    await ChangeProduct.save();

    invalidateCache({ product: true, admin: true, productId });

    return res.status(200).json({
      success: true,
      message: `Review deleted successfully.`,
    });
  }
);

export const getUserReviews = tryCatch(
  async (req: any, res: any, next: any) => {
    const { productId, userId } = req.params;

    if (!productId || !userId) {
      return next(new ErrorHandler("Product ID and User ID are required", 400));
    }

    // Fetch reviews for the given productId
    const productReviews = await Reviews.findOne({ productId });

    if (!productReviews) {
      return next(
        new ErrorHandler(
          `No reviews found for product with ID ${productId}`,
          404
        )
      );
    }

    // Filter the reviews that belong to the specified user
    const userReviews = productReviews.reviewsList.filter(
      (review) => review.userId === userId
    );

    if (userReviews.length === 0) {
      return next(
        new ErrorHandler(
          `No reviews found for user with ID ${userId} on product with ID ${productId}`,
          404
        )
      );
    }

    return res.status(200).json({
      success: true,
      reviews: userReviews,
    });
  }
);
