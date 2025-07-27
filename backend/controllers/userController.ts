import { Request, Response } from "express";
import { db } from "../config/db.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const response = await db.query("SELECT * FROM users ORDER BY id DESC");
    res.status(200).json({
      data: response.rows,
      message: "Users fetched successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
