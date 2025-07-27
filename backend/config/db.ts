// db.js
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: (process.env.DB_PORT && parseInt(process.env.DB_PORT, 10)) || 5432,
  database: process.env.DB_DATABASE,
});

// We export a query function that will be used throughout the app
export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
