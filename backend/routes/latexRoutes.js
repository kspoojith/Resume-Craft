import express from 'express';
import { compileLatex,getLatexFiles } from '../controllers/latexController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { compileTemplateById } from '../controllers/latexController.js'; // or wherever this lives

const latexRoutes = express.Router();
latexRoutes.post('/compile', authMiddleware, compileLatex);
latexRoutes.get('/files/:uuid', getLatexFiles);
latexRoutes.get('/compile/:id', compileTemplateById); // This is key!


export default latexRoutes;
