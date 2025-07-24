import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Template from '../models/Template.js';
import adminEmailOnly from '../middlewares/authMiddleware.js';

// GET /api/templates → list all templates
export const getAllTemplates = async (req, res) => {
  const templates = await Template.find();
  res.json(templates);
};

// GET /api/templates/:id → get single template by ID
export const getTemplateById = async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json(template);
};

// POST /api/templates → add new template (optional/admin only)
export const createTemplate = async (req, res) => {
  const { name, type, previewImage, description, mainTex, clsFile, sampleData } = req.body;

  if (!name || !type || !mainTex || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const template = await Template.create({
    name,
    type,
    previewImage,
    description,
    mainTex,
    clsFile: clsFile || '',   // optional
    sampleData: sampleData || {}  // optional
  });

  res.status(201).json(template);
};

export const createTemplateWithFiles = async (req, res) => {
  try {
    const { name, description, type, isPremium, uuid } = req.body;

    if (!name || !description || !type) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const files = req.files;
    if (!files) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    const texFile = files["texFile"]?.[0];
    const clsFile = files["clsFile"]?.[0];
    const previewImage = files["previewImage"]?.[0];
    const assets = files["assets"] || [];

    if (!texFile || !previewImage) {
      return res.status(400).json({ error: "Missing required template files." });
    }

    const uploadBasePath = path.join("templates/uploads", uuid); // relative path

    const texFilePath = path.join(uploadBasePath, texFile.filename);
    const clsFilePath = clsFile ? path.join(uploadBasePath, clsFile.filename) : "";
    const previewImagePath = path.join(uploadBasePath, previewImage.filename);
    const assetPaths = assets.map((file) =>
      path.join(uploadBasePath, file.filename)
    );

    const newTemplate = await Template.create({
      name,
      description,
      type,
      previewImage: previewImagePath,
      texFile: texFilePath,
      clsFile: clsFilePath,
      assets: assetPaths,
      isPremium: isPremium === "true" || false,
    });

    res.status(201).json({
      message: "Template created successfully",
      template: newTemplate,
    });
  } catch (err) {
    console.error("Template Upload Error:", err);
    res.status(500).json({ error: "Something went wrong while uploading template." });
  }
};




// DELETE /api/templates/:id → delete template (optional/admin only)
export const deleteTemplate = async (req, res) => {
  const deleted = await Template.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Template not found' });
  res.json({ message: 'Template deleted' });
};

function toRelativePath(fullPath) {
  // Find the index of 'templates/uploads' in the path
  const idx = fullPath.replace(/\\/g, "/").indexOf("templates/uploads");
  return idx !== -1 ? fullPath.replace(/\\/g, "/").slice(idx) : fullPath;
}
