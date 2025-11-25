import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  const { username, email, password, phone } = req.body; // Add phone here

  // Validate required fields
  if (!username || !email || !password) {
    return next(
      errorHandler(400, "Username, email, and password are required")
    );
  }

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone: phone || "", // Handle phone field
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  // Implement user login logic here
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    // Compare hashed passwords
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials"));
    }
    // If passwords match, generate and send JWT token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const userObj = validUser.toObject();
    const { password: pass, ...rest } = userObj;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({
        ...rest,
        token: token,
        success: true,
      });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const userObj = user.toObject();
      const { password: pass, ...rest } = userObj;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({
          ...rest,
          token: token,
          success: true,
        });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const userObj = newUser.toObject();
      const { password: pass, ...rest } = userObj;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({
          ...rest,
          token: token,
          success: true,
        });
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "User logged out successfully!",
    });
  } catch (error) {
    next(error);
  }
};
