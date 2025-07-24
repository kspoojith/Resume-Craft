import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  oauthLogin,
  linkedinLogin
} from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getMe);
router.post('/oauth', oauthLogin); 
router.post('/linkedin', linkedinLogin);



export default router;
