import express from "express";
import productRoutes from "./routes/product.route";
import orderRoutes from "./routes/order.route";
import productAnalyticsRoutes from "./routes/product.analytics.route";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

const app = express();

// Validate required environment variables
if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  console.error("❌ Missing required Clerk environment variables:");
  console.error("- CLERK_PUBLISHABLE_KEY");
  console.error("- CLERK_SECRET_KEY");
  console.error("Please check your .env file or environment configuration.");
  process.exit(1);
}

// Configure CORS before other middleware
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// Configure Clerk middleware
app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

app.use(express.json());

// Routes
app.use("/api", orderRoutes);
app.use("/products", productRoutes);
app.use("/products-analytics", productAnalyticsRoutes);

// Error handler should be last
app.use(errorHandler);

export default app;
