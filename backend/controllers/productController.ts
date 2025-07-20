import { Request, Response } from "express";
import { sql } from "../config/db.js";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const response = await sql`
    SELECT * FROM products
    ORDER BY id DESC
    `;
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
    const response = await sql`
    SELECT * FROM products WHERE id = ${id}
    `;
    if (response.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log(response);
    res.status(201).json({
      data: response[0],
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
    const response = await sql`
    INSERT INTO products (name, price, image)
    VALUES (${name}, ${price}, ${image})
    RETURNING *
    `;
    console.log(response);
    res
      .status(201)
      .json({ message: "Product created successfully", data: response });
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

    const response = await sql`
      UPDATE products
      SET name = ${name}, price = ${price}, image = ${image}
      WHERE id = ${id}
      RETURNING *
    `;

    if (response.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log(response);
    res.status(200).json({
      message: "Product updated successfully",
      data: response[0],
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
    const response = await sql`
    DELETE FROM products WHERE id = ${id}
    RETURNING *
    `;
    if (response.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log(response);
    
    console.log(`Product with ID ${id} deleted successfully`);  

    res.status(200).json({ message: "Product deleted successfully", data: {id} });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
