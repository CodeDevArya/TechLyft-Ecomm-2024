import mongoose, { Connection } from "mongoose";
import { invalidateCacheProps, OrderItemsType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";
import jwt from "jsonwebtoken";
import { Response } from "express";

let isConnected: Connection | boolean = false;

const connectDB = async (mongo_db_uri: string) => {
  if (isConnected) {
    console.log("Database already connected.");
    return isConnected;
  }

  try {
    const res = await mongoose.connect(mongo_db_uri);
    console.log("Database connected successfully");
    isConnected = res.connection;
    return isConnected;
  } catch (error) {
    console.log("Error connecting database", error);
    throw error;
  }
};

export default connectDB;

export const invalidateCache = ({
  product,
  order,
  admin,
  userID,
  orderId,
  productId,
}: invalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-product",
      "categories",
      "all-admin-products",
    ];

    if (typeof productId === "string") productKeys.push(`product-${productId}`);
    if (typeof productId === "object") {
      productId.forEach((id) => productKeys.push(`product-${id}`));
    }

    myCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "all-admin-orders",
      `my-orders-${userID}`,
      `order-details-id-${orderId}`,
    ];

    myCache.del(orderKeys);
  }
  if (admin) {
    myCache.del([
      "admin-dashboardStats",
      "admin-pie-chart",
      "admin-bar-chart",
      "admin-line-chart",
    ]);
  }
};

export const reduceStock = async (orderItems: OrderItemsType[]) => {
  try {
    for (const orderItem of orderItems) {
      const product = await Product.findById(orderItem.id); // Updated to use `productId`
      if (!product) {
        throw new Error(`Product with ID ${orderItem.id} Not Found`);
      }

      product.stock -= orderItem.quantity;
      if (product.stock < 0) {
        throw new Error(`Insufficient stock for product ID ${orderItem.id}`);
      }

      await product.save();
    }
  } catch (error) {
    // Log error or handle it appropriately
    console.error(error);
    throw new Error("Failed to reduce stock");
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) {
    return thisMonth * 100;
  }
  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getInventory = async ({
  productCategories,
  totalProductCount,
}: {
  productCategories: string[];
  totalProductCount: number;
}) => {
  const categoriesCountPromise = productCategories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCountWithName: Record<string, number>[] = [];

  productCategories.forEach((category, i) => {
    categoryCountWithName.push({
      [category]: Math.round((categoriesCount[i] / totalProductCount) * 100),
    });
  });
  return categoryCountWithName;
};

interface MyDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}
type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: FuncProps) => {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if (property) {
        data[length - monthDiff - 1] += i[property]!;
      } else {
        data[length - monthDiff - 1] += 1;
      }
    }
  });

  return data;
};

export const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateTokenAndSetCookie = (res: any, userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevents access to the cookie from JavaScript
    secure: process.env.NODE_ENV === "production", // Ensures cookie is sent over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Cross-site only in production, lax for local dev
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
  });

  return token;
};
