import express, { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { tryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-classes.js";
import { invalidateCache } from "../utils/features.js";
import { EnquiryMail } from "../mail/email.config.js";

export const getAllUsers = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});

    return res.status(200).json({ success: true, data: users });
  }
);

export const getUser = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user)
      return next(new ErrorHandler("User not found With this Id", 404));
    return res.status(200).json({ success: true, data: user });
  }
);

export const getUserByEmail = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const user = await User.findOne({ email: id });

    if (!user)
      return next(new ErrorHandler("User not found With this Id", 404));
    return res.status(200).json({ success: true, data: user });
  }
);

export const deleteUser = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user)
      return next(
        new ErrorHandler("User not found to Delete With this Id", 404)
      );

    await user.deleteOne();

    invalidateCache({
      admin: true,
    });

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  }
);

export const SendEnquiryMail = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, message } = req.body;

    EnquiryMail(email, message, name);

    return res
      .status(200)
      .json({ success: true, message: "Mail sent successfully" });
  }
);
