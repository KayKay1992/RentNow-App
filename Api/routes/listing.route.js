import express from 'express';
import { createListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Define your routes here
router.post('/create', verifyToken ,createListing)

export default router;