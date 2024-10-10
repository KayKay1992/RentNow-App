import express from "express";
import { signUp } from "../controllers/auth.controller.js";



const router = express.Router();

// Add your routes here
router.post("/signup", signUp)



export default router



