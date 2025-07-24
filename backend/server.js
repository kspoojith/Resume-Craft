import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
dotenv.config();
console.log('DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY);
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import uploadRoutes from './routes/upload.js';
import latexRoutes from './routes/latex.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:8080', 
  credentials: true
}));

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api', uploadRoutes); // POST /api/upload
app.use('/api/latex', latexRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/templates/uploads', express.static(path.join(__dirname, 'templates/uploads')));


// Error handler (optional)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
