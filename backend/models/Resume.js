import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  snapshotUrl: String,  // Last rendered image of resume
  latexCode: String,
  clsCode: String,      // Add .cls file content
  formData: Object,
  source: {
    type: String,
    enum: ['manual', 'form', 'upload', 'linkedin', 'template'],
    default: 'manual'
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    default: null
  },
  compilationData: {    // Store compilation paths and data
    uuid: String,       // Folder UUID for compilation
    texFilename: String, // Current .tex filename
    clsFilename: String, // Current .cls filename
    pdfUrl: String,     // Last generated PDF URL
    lastCompiled: Date  // When last compiled
  },
  enhancedWithAI: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Resume', resumeSchema);
