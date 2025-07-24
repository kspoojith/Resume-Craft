import express from 'express';
import { enhanceLatex } from '../controllers/aiController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { analyzeResume } from "../controllers/aiController.js";

const router = express.Router();
router.post('/enhance', authMiddleware, enhanceLatex);
router.post("/analyze", authMiddleware, analyzeResume);

export default router;
