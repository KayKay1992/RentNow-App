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

// ✅ CORS setup (support localhost + deployed frontend)
const allowedOrigins = [
  process.env.CLIENT_URL,         // your deployed frontend on Render
  "http://localhost:5173",        // local dev frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Root route (for testing)
app.get("/", (req, res) => {
  res.send("✅ Backend API is running");
});

// ✅ Routes (lowercase to match frontend calls)
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
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
