import mongoose from "mongoose";
const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: { type: String, required: true }, // e.g., 'modern', 'classic', etc.
  previewImage: String, // URL or path to preview image
  texFile: String,      // Path to .tex file
  clsFile: String,      // Path to .cls file
  assets: [String],     // Array of asset file paths (images, etc.)
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Template = mongoose.model('Template', TemplateSchema);
export default Template; 