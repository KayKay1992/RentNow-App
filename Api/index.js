// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from "dotenv";
// import cookieParser from 'cookie-parser';
// import path from 'path';

// // Import routes
// import userRouter from "./routes/user.route.js"
// import authRouter from "./routes/auth.route.js"
// import listingRouter from "./routes/listing.route.js"
// const port = process.env.PORT || 3000

// dotenv.config();

// mongoose.connect(process.env.MONGO_URI).then(()=> {
//     console.log('Connected to MongoDB');
// }).catch((err) => {
//     console.log(err)
// })

// const __dirname = path.resolve()

// const app = express();

// app.use(express.json())

// app.use(cookieParser())

// app.use("/api/user", userRouter)
// app.use("/api/auth", authRouter)
// app.use("/api/listing", listingRouter)

// //checking if the process.env.NODE_ENV === 'production'

// if (process.env.NODE_ENV === "production") {
//     // Serve static assets from the client/build folder in production mode
//     app.use(express.static(path.join(__dirname, "/client/dist")));

//     // any route that is not api will be redirected to index.html
//     app.get("*", (req, res) => {
//       res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
//     });
//   } else {
//     // Route to test if the API is running
//     app.get("/", (req, res) => {
//       res.send("Hello, World! My API is running");
//     });
//   }

// app.use((err, req, res, next) =>{
//     const statusCode = err.statusCode || 500;
//     const message = err.message || 'Internal Server Error'
//     return res.status(statusCode).json({
//         success: false,
//         message,
//         statusCode,
//     })
// })
// //checking if the process.env.NODE_ENV === 'production'

// if (process.env.NODE_ENV === "production") {
//     // Serve static assets from the client/build folder in production mode
//     app.use(express.static(path.join(__dirname, "/frontend/dist")));

//     // any route that is not api will be redirected to index.html
//     app.get("*", (req, res) => {
//       res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//     });
//   } else {
//     // Route to test if the API is running
//     app.get("/", (req, res) => {
//       res.send("Hello, World! My API is running");
//     });
//   }

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

// Import routes
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";

const port = process.env.PORT || 3000;

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Hello, World! My API is running");
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
