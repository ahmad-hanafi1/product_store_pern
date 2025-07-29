import express from "express";
import {
  generateRecipe,
  getSavedRecipes,
  deleteSavedRecipe,
  getSavedRecipeById,
} from "../controllers/recipeController.js";

const recipeRouter = express.Router();

recipeRouter
  .post("/generate", generateRecipe)
  .get("/", getSavedRecipes)
  .get("/:recipeId", getSavedRecipeById)
  .delete("/:recipeId", deleteSavedRecipe);

export default recipeRouter;
