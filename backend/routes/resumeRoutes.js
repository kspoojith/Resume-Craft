import express from 'express';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  saveResume,
  deleteResume,
  updateSnapshot
} from '../controllers/resumeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { incrementDownloadCount } from '../controllers/resumeController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getResumes);
router.get('/:id', getResumeById);
router.post('/', createResume);
router.put('/:id', updateResume);
router.post('/:id/save', saveResume);
router.delete('/:id', deleteResume);
router.post('/:id/snapshot', updateSnapshot);
router.post('/:id/increment-download', incrementDownloadCount);

export default router;
