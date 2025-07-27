import { getUsers } from "../controllers/userController.js";
import express from "express";

const userRoutes = express.Router();

userRoutes.get("/", getUsers);

export default userRoutes;
