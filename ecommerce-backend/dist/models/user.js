import mongoose from "mongoose";
import validator from "validator";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User name is required."],
        minlength: [3, "User name should be at least 3 characters long."],
    },
    email: {
        type: String,
        required: [true, "User email is required."],
        unique: [true, "Email already exists."],
        validate: validator.default.isEmail,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "User gender is required."],
    },
    dob: {
        type: Date,
        required: [true, "User date of birth is required."],
    },
    password: {
        type: String,
        required: [true, "User Password is required."],
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpireAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, {
    timestamps: true,
});
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
export const User = mongoose.model("User", schema);
