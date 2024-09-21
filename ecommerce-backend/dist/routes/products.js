import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { deleteProduct, getAdminProduct, getAllCategories, getLatestProduct, getProductById, getShopAllProduct, newProduct, updateProduct, } from "../controllers/products.js";
import { multipleUpload } from "../middlewares/multer.js";
// import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
app.post("/new", adminOnly, multipleUpload, newProduct);
app.get("/latest-products", getLatestProduct);
app.get("/shop-all", getShopAllProduct);
app.get("/categories", getAllCategories);
app.get("/admin-products", adminOnly, getAdminProduct);
app
    .route("/:id")
    .get(getProductById)
    .put(adminOnly, multipleUpload, updateProduct)
    .delete(adminOnly, deleteProduct);
export default app;
