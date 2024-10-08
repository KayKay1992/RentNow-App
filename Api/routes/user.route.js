import express from "express";
import { test } from "../controllers/user.controller.js";

const router =express.Router();

// Add your routes here
router.get('/test', test)

export default router;