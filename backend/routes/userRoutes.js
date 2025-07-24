import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/skills/suggestions', (req, res) => {
  const skills = [
    "React", "Node.js", "MongoDB", "Tailwind CSS", "Python", "LaTeX",
    "Next.js", "TypeScript", "GraphQL", "Docker", "AWS", "PostgreSQL"
  ];
  res.json(skills);
});
router.get('/languages/suggestions', (req, res) => {
  const languages = [
    "English", "Spanish", "French", "German", "Chinese", "Japanese",
    "Russian", "Portuguese", "Italian", "Korean"
  ];
  res.json(languages);
});


export default router;
