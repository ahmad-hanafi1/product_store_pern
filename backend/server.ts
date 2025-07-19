import express, { Express, Request, Response } from "express";


const app: Express = express();
const port = 3000;

// Define a route handler for the default home page
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world! This is a TypeScript server. 🚀");
});

// Start the server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
