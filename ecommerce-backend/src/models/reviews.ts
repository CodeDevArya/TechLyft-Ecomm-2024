import mongoose from "mongoose";

const schema = new mongoose.Schema({
  productId: {
    type: String,
    ref: "Products",
  },
  reviewsList: [
    {
      userId: {
        type: String,
        ref: "Users",
      },
      title: {
        type: String,
        required: [true, "Review title is required."],
        minlength: [3, "Review title should be at least 3 characters long."],
      },
      text: {
        type: String,
        required: [true, "Review text is required."],
      },
      rating: {
        type: Number,
        required: [true, "Review rating is required."],
        min: [1, "Rating must be at least 1."],
        max: [5, "Rating must be at most 5."],
      },
      name: {
        type: String,
        required: [true, "User name is required."],
        minlength: [3, "User name should be at least 3 characters long."],
      },
      reviewDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const Reviews = mongoose.model("Reviews", schema);
