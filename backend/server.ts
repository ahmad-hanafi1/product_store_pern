import express, { Express, Request, Response } from "express";
// import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import productRouter from "./routes/productRouter.js";
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";

dotenv.config(); // Load environment variables from .env file

const app: Express = express();
const PORT = process.env.PORT || 3000;

const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.ARCJET_KEY || "your-arcjet-site-key",
  characteristics: ["ip.src"], // Track requests by IP
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

// Middleware

app.use(express.json()); // Middleware to parse JSON bodies

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// app.use(helmet()); // Middleware for security headers

app.use(morgan("dev")); // Middleware for logging HTTP requests

// Middleware to handle CORS (Cross-Origin Resource Sharing)
app.use((req: Request, res: Response, next: Function) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next(); // Pass control to the next middleware
});

// Middleware to handle 404 Not Found errors

app.use("/api/product", productRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world! This is a TypeScript server. 🚀");
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});
async function initializeDB() {
  try {
    // Import the database connection from the config file
    const { sql } = await import("./config/db.js");

    // Example query to test the connection
    await sql`SELECT 1`;
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection failed:", error);
    console.log("error here");
    process.exit(1); // Exit the process if the database connection fails
  }
}

initializeDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit the process if the server fails to start
  });
