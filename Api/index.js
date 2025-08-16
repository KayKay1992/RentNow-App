import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import listingRouter from "./routes/listing.route.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup (for your deployed frontend)
app.use(
  cors({
    origin: "https://rent-now-app-inl2-client.vercel.app", // your client URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api/listing", listingRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Database connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Vercel requires a default export of the server (not listen)
export default app;
