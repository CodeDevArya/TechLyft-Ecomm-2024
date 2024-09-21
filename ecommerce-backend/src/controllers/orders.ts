import { Request } from "express";
import { tryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/orders.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-classes.js";
import { myCache } from "../app.js";

export const myOrders = tryCatch(async (req, res, next) => {
  const { id: user } = req.query;

  if (!user) {
    return next(new ErrorHandler("Please provide user id", 401));
  }

  const key = `my-orders-${user}`;

  let orders = [];

  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key) as string);
  } else {
    orders = await Order.find({ user });
    myCache.set(key, JSON.stringify(orders));
  }

  res.status(200).json({ success: true, orders });
});

export const allOrders = tryCatch(async (req, res, next) => {
  let orders = [];

  if (myCache.has("all-admin-orders")) {
    orders = JSON.parse(myCache.get("all-admin-orders") as string);
  } else {
    orders = await Order.find().populate("user", "name");
    myCache.set("all-admin-orders", JSON.stringify(orders));
  }

  res.status(200).json({ success: true, orders });
});

export const getOrderDetailsById = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const key = `order-details-id-${id}`;
  let order;

  if (myCache.has(key)) {
    order = JSON.parse(myCache.get(key) as string);
  } else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) return next(new ErrorHandler("Order not found", 404));
    myCache.set(key, JSON.stringify(order));
  }

  res.status(200).json({ success: true, order });
});

export const newOrder = tryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      cartItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    if(!shippingInfo){
      return next(new ErrorHandler("Shipping info is required", 400));
    }

    if(!cartItems){
      return next(new ErrorHandler("Cart items are required", 400));
    }

    if(!user){
      return next(new ErrorHandler("User is required", 400));
    }

    if(!subtotal){
      return next(new ErrorHandler("Subtotal is required", 400));
    }

    if(!total){
      return next(new ErrorHandler("Total is required", 400));
    }
    
    const order = await Order.create({
      shippingInfo,
      orderItems: cartItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });

    await reduceStock(cartItems);

    invalidateCache({
      product: true,
      order: true,
      admin: true,
      userID: user,
      productId: order.orderItems.map((item) => String(item.id)),
    });

    res
      .status(200)
      .json({ success: true, message: "Order placed successfully" });
  }
);

export const processOrder = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";

      break;

    case "Shipped":
      order.status = "Delivered";

    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userID: order.user,
    orderId: String(order._id),
  });

  res
    .status(200)
    .json({ success: true, message: "Order Processed successfully" });
});

export const deleteOrder = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  await order.deleteOne();

  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userID: order.user,
    orderId: String(order._id),
  });

  res
    .status(200)
    .json({ success: true, message: "Order Deleted successfully" });
});
