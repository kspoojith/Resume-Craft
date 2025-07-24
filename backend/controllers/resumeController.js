import Resume from '../models/Resume.js';
import { createNotification } from './notificationController.js';

// GET /api/resumes → Get all resumes for current user
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.userId })
      .populate('templateId', 'name type')
      .sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes', error: error.message });
  }
};

// GET /api/resumes/:id → Get single resume
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId })
      .populate('templateId', 'name type texFile clsFile');
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume', error: error.message });
  }
};

// POST /api/resumes → Create new resume
export const createResume = async (req, res) => {
  try {
    const { title, latexCode, clsCode, formData, source, templateId, compilationData } = req.body;

    const newResume = await Resume.create({
      userId: req.user.userId,
      title: title || 'Untitled Resume',
      latexCode,
      clsCode,
      formData,
      source,
      templateId,
      compilationData,
    });

    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({ message: 'Error creating resume', error: error.message });
  }
};

// PUT /api/resumes/:id → Update resume
export const updateResume = async (req, res) => {
  try {
    const { latexCode, clsCode, formData, title, compilationData } = req.body;

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    if (title) resume.title = title;
    if (latexCode !== undefined) resume.latexCode = latexCode;
    if (clsCode !== undefined) resume.clsCode = clsCode;
    if (formData !== undefined) resume.formData = formData;
    if (compilationData !== undefined) resume.compilationData = compilationData;
    resume.updatedAt = new Date();

    const updated = await resume.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating resume', error: error.message });
  }
};

// POST /api/resumes/:id/save → Save current state
export const saveResume = async (req, res) => {
  try {
    const { latexCode, clsCode, title, compilationData } = req.body;

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    if (title) resume.title = title;
    if (latexCode !== undefined) resume.latexCode = latexCode;
    if (clsCode !== undefined) resume.clsCode = clsCode;
    if (compilationData !== undefined) resume.compilationData = compilationData;
    resume.updatedAt = new Date();

    const updated = await resume.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error saving resume', error: error.message });
  }
};

// DELETE /api/resumes/:id → Delete resume
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!resume) return res.status(404).json({ message: 'Resume not found or already deleted' });
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume', error: error.message });
  }
};

// POST /api/resumes/:id/snapshot → Upload/update snapshot image
export const updateSnapshot = async (req, res) => {
  try {
    const { snapshotUrl } = req.body;

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    resume.snapshotUrl = snapshotUrl;
    resume.updatedAt = new Date();

    await resume.save();
    res.json({ message: 'Snapshot updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating snapshot', error: error.message });
  }
};

export const incrementDownloadCount = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ downloadCount: resume.downloadCount });
    await createNotification({
      userId: req.user.userId,
      type: 'download',
      title: 'Resume Download Complete',
      message: `Your resume "${resume.title}" has been downloaded.`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing download count', error: error.message });
  }
};
