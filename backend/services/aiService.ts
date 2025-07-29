import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";

// Initialize the Google AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

/**
 * Generates a recipe using the Gemini 1.5 Flash model with a specific JSON output structure.
 * @param ingredients - An array of strings representing the ingredients.
 * @returns A structured recipe object or null if an error occurs.
 */
export const generateRecipeWithGemini = async (ingredients: string[]) => {
  // 1. Get the generative model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 2. Define the exact JSON structure you want the AI to return
  const jsonSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
      title: { type: SchemaType.STRING },
      description: { type: SchemaType.STRING },
      ingredients: {
        type: SchemaType.ARRAY,
        // The AI will be instructed to format these strings as "1 tbsp salt"
        items: { type: SchemaType.STRING },
      },
      instructions: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
      },
      prep_time_minutes: {
        type: SchemaType.INTEGER,
        description: "Estimated preparation time in whole minutes.",
      },
      servings: {
        type: SchemaType.INTEGER,
        description: "Number of servings this recipe provides.",
      },
    },
    required: [
      "title",
      "description",
      "ingredients",
      "instructions",
      "prep_time_minutes",
      "servings",
    ],
  };

  // 3. Create the prompt for the AI
  const ingredientList = ingredients.join(", ");
  const prompt = `You are a creative chef. Create a simple and delicious recipe using ONLY the following ingredients: ${ingredientList}. For the final recipe's ingredient list, specify the exact quantity and unit for each item (e.g., "1 tbsp salt", "100g carrots", "1/2 onion"). Also, provide an estimated total preparation time in minutes. Provide a short, enticing description for the recipe. Provide how many portions this recipe serves.`;

  try {
    // 4. Call the model with the prompt and JSON mode configuration
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
      },
    });

    // 5. Extract and parse the JSON response
    const responseText = result.response.text();
    const recipe = JSON.parse(responseText);

    return recipe;
  } catch (error) {
    console.error("Error generating recipe with Gemini:", error);
    return null; // Return null to indicate an error
  }
};
