import { stripe } from "../app.js";
import { tryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupons.js";
import ErrorHandler from "../utils/utility-classes.js";

export const stripePayment = tryCatch(async (req: any, res: any, next: any) => {
  const { amount } = req.body;

  if (!amount) {
    return next(new ErrorHandler("Please provide amount", 400));
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr",
  });

  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

export const newCoupon = tryCatch(async (req: any, res: any, next: any) => {
  const { coupon, amount } = req.body;

  if (!coupon || !amount) {
    return next(new ErrorHandler("Please provide coupon code and amount", 400));
  }

  await Coupon.create({ couponCode: coupon, amount });

  return res.status(201).json({
    success: true,
    message: `Coupon "${coupon}" created successfully.`,
  });
});

export const applyDiscount = tryCatch(async (req: any, res: any, next: any) => {
  const { coupon } = req.query;

  const couponDiscount = await Coupon.findOne({ couponCode: coupon });

  if (!couponDiscount) {
    return next(new ErrorHandler("Invalid Coupon Code", 400));
  }

  return res.status(200).json({
    success: true,
    discount: couponDiscount.amount,
  });
});

export const getAllCoupons = tryCatch(async (req: any, res: any, next: any) => {
  const coupons = await Coupon.find({});

  if (!coupons) {
    return next(new ErrorHandler("Error Finding Coupons", 400));
  }

  return res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = tryCatch(async (req: any, res: any, next: any) => {
  const { id } = req.params;

  if (!id) return next(new ErrorHandler("Coupon Id is Required", 400));

  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) return next(new ErrorHandler("Invalid Coupon Id ", 400));

  return res.status(200).json({
    success: true,
    message: `Coupon "${coupon.couponCode}" Deleted Successfully`,
  });
});
