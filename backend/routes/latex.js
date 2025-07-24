// routes/latex.js
import express from 'express';
import { uploadLatexFiles } from '../controllers/uploadLatexFiles.js';
import { compileLatex } from '../controllers/latexController.js'; 

const latexRoutes = express.Router();

latexRoutes.post('/upload', uploadLatexFiles);
latexRoutes.post('/compile', (req, res, next) => {
  console.log("HIT /api/latex/compile");
  next();
}, compileLatex); 

export default latexRoutes;
