import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import Template from '../models/Template.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const compileLatex = async (req, res) => {
  try {
    const { uuid, filename } = req.body;

    if (!uuid || !filename) {
      return res.status(400).json({ error: "UUID and filename are required." });
    }

    const baseUploadPath = path.join(__dirname, "..", "templates", "uploads");
    const templateDir = path.join(baseUploadPath, uuid); // ✅ Correct path
    const inputFilePath = path.join(templateDir, filename);

    console.log("Looking for file at:", inputFilePath);
    if (!fs.existsSync(inputFilePath)) {
      console.log("File not found!");
      return res.status(404).json({ error: "LaTeX file not found." });
    }

    console.log("📂 Full Upload Path:", templateDir);

    const command = `docker run --rm -v "${templateDir}:/data" mylatex latexmk -pdf -interaction=nonstopmode -output-directory=/data "/data/${filename}"`;

    console.log("🚀 Running Command:", command);

    exec(command, (error, stdout, stderr) => {
      const compiledPdfPath = path.join(templateDir, filename.replace(".tex", ".pdf"));

      if (fs.existsSync(compiledPdfPath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
        return res.sendFile(compiledPdfPath);
      }

      // If PDF was not generated, return error
      if (error) {
        console.error("❌ Compilation Error:", error);
        console.error(stderr);
        return res.status(500).json({ error: "LaTeX compilation failed.", stderr });
      }

      return res.status(500).json({ error: "PDF was not generated." });
    });
  } catch (err) {
    console.error("⚠️ Compile Error:", err);
    res.status(500).json({ error: "Something went wrong during compilation." });
  }
};

