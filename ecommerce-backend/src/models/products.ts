import mongoose from "mongoose";
import { trim } from "validator";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
      minlength: [3, "Product name should be at least 3 characters long."],
    },
    photos: [
      {
        type: String,
        required: [true, "Product Images are required."],
      },
    ],
    description: {
      type: String,
      required: [true, "Product Description is required."],
    },
    price: {
      type: Number,
      required: [true, "Product Price is required."],
    },
    stock: {
      type: Number,
      required: [true, "Product Stock is required."],
    },
    category: {
      type: String,
      required: [true, "Product Category is required."],
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Products", schema);
