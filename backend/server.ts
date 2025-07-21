import express, { Express, Request, Response } from "express";
// import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import productRouter from "./routes/productRouter.js";
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";
import { aj } from "./lib/arcjet.js";

dotenv.config(); // Load environment variables from .env file

const app: Express = express();
const PORT = process.env.PORT || 3000;



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

// Arcjet middleware for bot detection and rate limiting
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});



// Middleware to handle 404 Not Found errors
app.use("/api/product", productRouter);

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
