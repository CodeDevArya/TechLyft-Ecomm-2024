import { tryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
import ErrorHandler from "../utils/utility-classes.js";
import { rm, unlink } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
import { promisify } from "util";
const unlinkAsync = promisify(unlink);
const rmAsync = promisify(rm);
export const getLatestProduct = tryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("latest-product")) {
        products = JSON.parse(myCache.get("latest-product"));
    }
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(4);
        myCache.set("latest-product", JSON.stringify(products));
    }
    return res.status(200).json({ success: true, products });
});
export const getAllCategories = tryCatch(async (req, res, next) => {
    let categories;
    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories"));
    }
    else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({ success: true, categories });
});
export const getAdminProduct = tryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("all-admin-products")) {
        products = JSON.parse(myCache.get("all-admin-products"));
    }
    else {
        products = await Product.find({});
        myCache.set("all-admin-products", JSON.stringify(products));
    }
    return res.status(200).json({ success: true, products });
});
export const getProductById = tryCatch(async (req, res, next) => {
    let product;
    if (myCache.has(`product-${req.params.id}`)) {
        product = JSON.parse(myCache.get(`product-${req.params.id}`));
    }
    else {
        product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler("Product Not Found", 404));
        }
        myCache.set(`product-${req.params.id}`, JSON.stringify(product));
    }
    return res.status(200).json({ success: true, product });
});
export const getShopAllProduct = tryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 9;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search) {
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    }
    if (price) {
        baseQuery.price = {
            $lte: Number(price),
        };
    }
    if (category) {
        baseQuery.category = category;
    }
    const productPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "low-to-high" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [products, FilteredOnlyProducts] = await Promise.all([
        productPromise,
        Product.find(baseQuery),
    ]);
    const totalPage = Math.ceil(FilteredOnlyProducts.length / limit);
    return res.status(200).json({ success: true, products, totalPage });
});
export const newProduct = tryCatch(async (req, res, next) => {
    const { name, category, price, stock, description } = req.body;
    const photos = req.files; // Expecting an array of files
    if (!name || !category || !price || !stock || !description) {
        // Delete uploaded files if validation fails
        if (photos && photos.length > 0) {
            await Promise.all(photos.map(async (photo) => {
                try {
                    await rmAsync(photo.path);
                    console.log("Deleted photo file from temporary storage:", photo.path);
                }
                catch (err) {
                    console.error("Error occurred while deleting file:", err);
                }
            }));
        }
        return next(new ErrorHandler("Please Provide All Fields", 400));
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    try {
        const photoPaths = photos.map((photo) => photo.path);
        const product = await Product.create({
            name,
            price,
            stock,
            category: capitalizeFirstLetter(category.toLowerCase()),
            photos: photoPaths, // Save array of photo paths
            description,
        });
        invalidateCache({ product: true, admin: true });
        return res.status(200).json({
            success: true,
            message: "Product created successfully.",
            product,
        });
    }
    catch (error) {
        return next(new ErrorHandler("Failed to create product", 500));
    }
});
export const updateProduct = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, category, price, stock, description } = req.body;
    const newPhotos = req.files; // Expecting an array of files
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    // Handle new photos
    if (newPhotos && newPhotos.length > 0) {
        // Delete existing photos
        if (product.photos && product.photos.length > 0) {
            await Promise.all(product.photos.map(async (photoPath) => {
                try {
                    await unlinkAsync(photoPath);
                    console.log("Deleted old photo file from storage:", photoPath);
                }
                catch (err) {
                    console.error("Error occurred while deleting file:", err);
                }
            }));
        }
        // Update product with new photos
        product.photos = newPhotos.map((photo) => photo.path);
    }
    // Update other product fields
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    if (description)
        product.description = description;
    await product.save();
    invalidateCache({
        product: true,
        productId: String(id),
        admin: true,
    });
    return res.status(200).json({
        success: true,
        message: "Product Updated successfully.",
    });
});
export const deleteProduct = tryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    // Ensure the file paths are correctly obtained and used
    if (product.photos && product.photos.length > 0) {
        try {
            await Promise.all(product.photos.map(async (filePath) => {
                try {
                    await unlinkAsync(filePath);
                    console.log("Product Photo Deleted:", filePath);
                }
                catch (err) {
                    console.error("Error deleting product photo:", err);
                    // Optionally, handle the error or pass it to the next middleware
                }
            }));
        }
        catch (err) {
            console.error("Error occurred while deleting product photos:", err);
            return next(new ErrorHandler("Error deleting product photos", 500));
        }
    }
    await Product.deleteOne({ _id: req.params.id });
    invalidateCache({
        product: true,
        productId: String(product._id),
        admin: true,
    });
    return res.status(200).json({
        success: true,
        message: "Product Deleted successfully.",
    });
});
