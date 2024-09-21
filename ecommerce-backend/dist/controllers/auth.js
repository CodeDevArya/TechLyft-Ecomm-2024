import crypto from "crypto";
import { sendMail, sendPasswordResetEmail, sendResetSuccessEmail, sendWelcomeEmail, } from "../mail/email.config.js";
import { tryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { generateTokenAndSetCookie, generateVerificationToken, invalidateCache, } from "../utils/features.js";
import ErrorHandler from "../utils/utility-classes.js";
import bcryptjs from "bcryptjs";
export const checkAuthUsers = tryCatch(async (req, res, next) => {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "user not found",
        });
    }
    res.status(201).json({
        success: true,
        user,
    });
});
export const signUp = tryCatch(async (req, res, next) => {
    const { name, email, gender, dob, password } = req.body;
    if (!email || !name || !gender || !dob || !password) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
        return next(new ErrorHandler("User already exists", 400));
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const newUser = await User.create({
        name,
        email,
        gender,
        dob,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours
    });
    await newUser.save();
    //jwt
    generateTokenAndSetCookie(res, newUser._id);
    await sendMail(newUser.email, verificationToken);
    invalidateCache({
        admin: true,
    });
    res.status(201).json({
        success: true,
        message: "User registered successfully.",
        user: {
            ...newUser.toObject(),
            password: undefined, //remove password from response
        },
    });
});
export const verifyEmail = tryCatch(async (req, res, next) => {
    const { code } = req.body;
    const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Verification token expired or invalid",
        });
    }
    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    return res.status(200).json({
        success: true,
        message: "Email successfully verified",
        user: {
            ...user.toObject(),
            password: undefined, //remove password from response
        },
    });
});
export const login = tryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("Invalid credentials", 400));
    }
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Password", 400));
    }
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: {
            ...user.toObject(),
            password: undefined, //remove password from response
        },
    });
});
export const logout = tryCatch(async (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});
export const forgotPassword = tryCatch(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found with this email",
        });
    }
    //generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpireAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpireAt = resetTokenExpireAt;
    await user.save();
    //send email
    await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/reset-password/${resetToken}`);
    res.status(200).json({
        success: true,
        message: "Password reset link sent successfully",
    });
});
export const resetPassword = tryCatch(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
        return next(new ErrorHandler("Please provide a new password", 400));
    }
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpireAt: { $gt: Date.now() },
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Password reset link expired or invalid",
        });
    }
    //update password
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;
    await user.save();
    await sendResetSuccessEmail(user.email);
    res.status(200).json({
        success: true,
        message: "Password reset successfull",
    });
});
