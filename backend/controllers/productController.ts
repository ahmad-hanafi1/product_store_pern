import { Request, Response } from "express";
import { db } from "../config/db.js"; // Import the SQL client from the database configuration

export const getProducts = async (req: Request, res: Response) => {
  try {
    const response = await db.query("SELECT * FROM products ORDER BY id DESC");
    console.log(response);
    res.status(200).json({
      data: response,
      message: "Products fetched successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await db.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (response.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log(response);
    res.status(201).json({
      data: response.rows[0],
      message: `Product ${id} fetched successfully`,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, image } = req.body;
  if (!name || !price || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const response = await db.query(
      "INSERT INTO products (name, price, image) VALUES ($1, $2, $3) RETURNING *",
      [name, price, image]
    );
    console.log(response);
    res
      .status(201)
      .json({
        message: "Product created successfully",
        data: response.rows[0],
      });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Failed to create product";
    res.status(500).json({ error: errMsg });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const response = await db.query(
      "UPDATE products SET name = $1, price = $2, image = $3 WHERE id = $4 RETURNING *",
      [name, price, image, id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log(response);
    res.status(200).json({
      message: "Product updated successfully",
      data: response.rows[0],
    });
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "Failed to create product";
    res.status(500).json({ error: errMsg });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await db.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    if (response.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log(response);

    console.log(`Product with ID ${id} deleted successfully`);

    res
      .status(200)
      .json({ message: "Product deleted successfully", data: { id } });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
