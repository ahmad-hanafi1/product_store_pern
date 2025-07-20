import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter
  .get("/", getProducts)
  .get("/:id", getProduct)
  .post("/", createProduct)
  .put("/:id", updateProduct)
  .delete("/:id", deleteProduct);

export default productRouter;
