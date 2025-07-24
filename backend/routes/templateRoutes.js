import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import {v4 as uuidv4} from 'uuid';
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  getAllTemplates,
  getTemplateById,
  createTemplateWithFiles, // <-- new controller
  createTemplate,
  deleteTemplate
} from '../controllers/templateController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import path from 'path';


const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uuid = req.body.uuid || req.query.uuid || uuidv4(); // use uuid if passed or generate new
    req.body.uuid = uuid; // Make sure it's available in controller
    const uploadPath = path.join(__dirname, '../templates/uploads', uuid);
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure folder exists
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// File upload route (admin only)
router.post(
  '/upload',
  authMiddleware,
  upload.fields([
    { name: 'previewImage', maxCount: 1 },
    { name: 'texFile', maxCount: 1 },
    { name: 'clsFile', maxCount: 1 },
    { name: 'assets', maxCount: 10 }
  ]),
  createTemplateWithFiles
);

router.get('/', getAllTemplates); // Public
router.get('/:id', getTemplateById); // Public

// Protected routes for admin (optional)
router.post('/', authMiddleware, createTemplate);
router.delete('/:id', authMiddleware, deleteTemplate);

// Serve uploaded template files

export default router;
