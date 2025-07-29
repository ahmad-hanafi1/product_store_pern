import { Request, Response } from "express";
import { generateRecipeWithGemini } from "../services/aiService.js";
import { db } from "../config/db.js";

export const generateRecipe = async (req: Request, res: Response) => {
  const { ingredients } = req.body;

  const userId = req.user?.id;

  // Validate input
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide a list of ingredients." });
  }

  //   Check if user is authenticated
  if (!userId) {
    return res.status(401).json({ message: "Not authorized." });
  }

  try {
    // Call the AI service to generate the recipe
    const recipe = await generateRecipeWithGemini(ingredients);

    if (!recipe) {
      return res
        .status(500)
        .json({ message: "Failed to generate recipe. Please try again." });
    }

    // Save the generated recipe to the database
    const {
      title,
      description,
      ingredients: recipeIngredients,
      instructions,
      prep_time_minutes,
      servings,
    } = recipe;

    const { rows } = await db.query(
      `INSERT INTO saved_recipes (user_id, recipe_title, description, ingredients, instructions, prep_time_minutes, servings)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`, // <-- 1. Add this line
      [
        userId,
        title,
        description,
        JSON.stringify(recipeIngredients),
        JSON.stringify(instructions),
        prep_time_minutes,
        servings,
      ]
    );

    res.status(200).json(rows[0]); // Return the saved recipe
  } catch (error) {
    console.error("Recipe generation controller error:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};

export const getSavedRecipes = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Not authorized." });
  }

  try {
    const { rows } = await db.query(
      "SELECT * FROM saved_recipes WHERE user_id = $1",
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};

export const getSavedRecipeById = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { recipeId } = req.params;
  if (!userId) {
    return res.status(401).json({ message: "Not authorized." });
  }
  try {
    const { rows } = await db.query(
      "SELECT * FROM saved_recipes WHERE id = $1 AND user_id = $2",
      [recipeId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching saved recipe:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};

export const deleteSavedRecipe = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { recipeId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Not authorized." });
  }

  try {
    const result = await db.query(
      "DELETE FROM saved_recipes WHERE id = $1 AND user_id = $2 RETURNING *",
      [recipeId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (error) {
    console.error("Error deleting saved recipe:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};
