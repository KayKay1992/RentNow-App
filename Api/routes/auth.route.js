import express from "express";
import { google, signIn, signOut, signUp } from "../controllers/auth.controller.js";



const router = express.Router();

// Add your routes here
router.post("/signup", signUp)
router.post("/signin", signIn)
router.post("/google", google)
router.get("/signout", signOut)



export default router



