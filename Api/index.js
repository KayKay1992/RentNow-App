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

// CORS setup
const allowedOrigins = [
  process.env.CLIENT_URL || "https://rentnow-d4su.onrender.com", // Fallback to deployed frontend
  "http://localhost:5173", // Local dev frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(`CORS Origin: ${origin}`); // Debug log
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url} from ${req.get("origin")}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("✅ Backend API is running");
});

// Routes
app.use("/api/listing", listingRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`); // Log errors for debugging
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
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));