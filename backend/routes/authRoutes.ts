// src/routes/authRouter.ts

import express from "express";
import { login, register } from "../controllers/authController.js";

const authRouter = express.Router();

// Route for user registration
authRouter.post("/register", register)
.post("/login", login); 



export default authRouter;
