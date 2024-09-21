import mongoose from "mongoose";
const schema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: [true, "Coupon code is required."],
        unique: [true, "Coupon already exists."],
        minlength: [3, "Coupon code should be at least 3 characters long."],
        maxlength: [20, "Coupon code should not exceed 20 characters."],
        match: /^[A-Za-z0-9!@#$%^&*()_+\-=]+$/,
    },
    amount: {
        type: Number,
        required: [true, "Coupon amount is required."],
    },
});
export const Coupon = mongoose.model("Coupons", schema);
