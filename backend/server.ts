import express, { Express, Request, Response } from "express";
// import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { aj } from "./lib/arcjet.js";
// import { db } from "./config/db.js";

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

async function startServer() {
  try {
    // 1. Dynamically import everything needed
    const { db } = await import("./config/db.js");
    const authRouter = (await import("./routes/authRoutes.js")).default;
    const productRouter = (await import("./routes/productRouter.js")).default;
    const userRoutes = (await import("./routes/userRoutes.js")).default;
    const { protect } = await import("./middleware/authMiddleware.js");

    // 2. Test the database connection
    await db.query("SELECT NOW()");
    console.log("Database connection established successfully.");

    // 3. Set up all your routes
    app.use("/api/auth", authRouter);
    app.use("/api/product", productRouter);
    app.use("/api/users", protect, userRoutes);

    // 4. Set up the 404 handler (runs if no other route matches)
    app.use((req: Request, res: Response) => {
      res.status(404).json({ error: "Not Found" });
    });

    // 5. Start the server and keep it running
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error);
    process.exit(1); // Exit the process if startup fails
  }
}

// --- Start the application ---
startServer();
