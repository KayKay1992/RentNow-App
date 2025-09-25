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
  "https://rentnow-d4su.onrender.com", // Explicitly include deployed frontend
  "http://localhost:5173", // Local dev frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(`CORS: Request from origin=${origin}`);
      if (!origin || allowedOrigins.includes(origin)) {
        console.log(`CORS: Allowing origin=${origin}`);
        callback(null, origin || "*"); // Return the specific origin or "*" for non-browser requests
      } else {
        console.log(`CORS: Blocking origin=${origin}`);
        callback(new Error(`CORS blocked: ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Log all requests
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url} from origin=${req.get("origin")}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("✅ Backend API is running");
});

// Test DB route
app.get("/test-db", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    res.status(200).json({ message: "MongoDB connected successfully" });
  } catch (error) {
    console.error("MongoDB test error:", error);
    res.status(500).json({ message: "MongoDB connection failed", error: error.message });
  }
});

// Routes
app.use("/api/listing", listingRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}, Path: ${req.path}, Origin: ${req.get("origin")}`);
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



// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// // Routes
// import listingRouter from "./routes/listing.route.js";
// import userRouter from "./routes/user.route.js";
// import authRouter from "./routes/auth.route.js";

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// // CORS setup with preflight handling
// const allowedOrigins = [
//   "https://rentnow-d4su.onrender.com", // Deployed frontend
//   "http://localhost:5173", // Local dev frontend
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       console.log(`CORS: Request from origin=${origin}`);
//       if (!origin || allowedOrigins.includes(origin)) {
//         console.log(`CORS: Allowing origin=${origin || '*'}`);
//         callback(null, origin || "*");
//       } else {
//         console.log(`CORS: Blocking origin=${origin}`);
//         callback(new Error(`CORS blocked: ${origin} not allowed`));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     // Ensure CORS headers are sent for all responses, including errors
//     exposedHeaders: ["Access-Control-Allow-Origin"],
//   })
// );

// // Handle CORS preflight requests explicitly
// app.options("*", cors());

// // Log all requests for debugging
// app.use((req, res, next) => {
//   console.log(`Request: ${req.method} ${req.url} from origin=${req.get("origin")}`);
//   next();
// });

// // Root route
// app.get("/", (req, res) => {
//   res.send("✅ Backend API is running");
// });

// // Test DB route
// app.get("/test-db", async (req, res) => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     res.status(200).json({ message: "MongoDB connected successfully" });
//   } catch (error) {
//     console.error("MongoDB test error:", error);
//     res.status(500).json({ message: "MongoDB connection failed", error: error.message });
//   }
// });

// // Routes
// app.use("/api/listing", listingRouter);
// app.use("/api/user", userRouter);
// app.use("/api/auth", authRouter);

// // Error handler middleware to ensure CORS headers are included
// app.use((err, req, res, next) => {
//   console.error(`Error: ${err.message}, Path: ${req.path}, Origin: ${req.get("origin")}, Stack: ${err.stack}`);
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";
  
//   // Ensure CORS headers are included in error responses
//   res.setHeader("Access-Control-Allow-Origin", allowedOrigins.includes(req.get("origin")) ? req.get("origin") : "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
//   res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//   });
// });

// // Database connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB error:", err));

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));