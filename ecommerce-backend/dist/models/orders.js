import mongoose from "mongoose";
const schema = new mongoose.Schema({
    shippingInfo: {
        name: {
            type: String,
            required: [true, "User name is required."],
            minlength: [3, "User name should be at least 3 characters long."],
        },
        phone: {
            type: Number,
            required: [true, "User phone number is required."],
            validate: {
                validator: (value) => /^[6-9]\d{9}$/.test(value),
                message: "Phone number is not valid.",
            },
        },
        country: {
            type: String,
            required: [true, "User country is required."],
        },
        pincode: {
            type: Number,
            required: [true, "User pincode is required."],
            validate: {
                validator: (value) => /^\d{6}$/.test(value),
                message: "Pincode is not valid.",
            },
        },
        address: {
            type: String,
            required: [true, "User shipping address is required."],
        },
        city: {
            type: String,
            required: [true, "User city is required."],
        },
        state: {
            type: String,
            required: [true, "User state is required."],
        },
    },
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    subtotal: {
        type: Number,
        required: [true, "Subtotal is required."],
    },
    tax: {
        type: Number,
        default: 0,
    },
    shippingCharges: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        required: [true, "Total is required."],
    },
    status: {
        type: String,
        enum: ["Delivered", "Shipped", "Processing"],
        default: "Processing",
    },
    orderItems: [
        {
            name: String,
            imageSrc: String,
            price: Number,
            quantity: Number,
            id: String,
        },
    ],
}, {
    timestamps: true,
});
export const Order = mongoose.model("Orders", schema);
