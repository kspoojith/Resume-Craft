import React, { useEffect, useState } from "react";
import axios from "axios";

interface Template {
  _id: string;
  name: string;
  type: string;
  previewImage?: string;
  description?: string;
  isPremium?: boolean;
}

const getPreviewImageUrl = (previewImage: string) => {
  if (!previewImage) return "";
  const match = previewImage.match(/templates[\\/]+uploads[\\/]+.+/);
  const relativePath = match ? match[0].replace(/\\/g, "/") : "";
  return `https://resume-craft-cswr.onrender.com/${relativePath}`;
};

const adminEmail = "suryapoojith9805@gmail.com";
const user = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = user.email === adminEmail;


const AdminTemplates: React.FC = () => {
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Admin Only</h2>
        <p>You do not have permission to upload templates.</p>
      </div>
    );
  }

  const [form, setForm] = useState({
    templateName: "",
    description: "",
    category: "",
    isPremium: false,
  });

  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [texFile, setTexFile] = useState<File | null>(null);
  const [clsFile, setClsFile] = useState<File | null>(null);
  const [assets, setAssets] = useState<FileList | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    axios.get("https://resume-craft-cswr.onrender.com/api/templates").then((res) => setTemplates(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.templateName || !form.category || !texFile || !previewImage) {
    setMessage("Name, category, preview image, and .tex file are required.");
    return;
  }

  const data = new FormData();
  data.append("name", form.templateName);
  data.append("description", form.description);
  data.append("type", form.category);
  data.append("isPremium", String(form.isPremium));
  data.append("previewImage", previewImage);     // Required
  data.append("texFile", texFile);               // Required

  if (clsFile) data.append("clsFile", clsFile);  // Optional

  if (assets && assets.length > 0) {
    Array.from(assets).forEach((file) => {
      data.append("assets", file);               // Optional asset images/fonts
    });
  }

  try {
    await axios.post("https://resume-craft-cswr.onrender.com/api/templates/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-user-email": user.email, // Required for ownership tagging
      },
    });

    setMessage("Template uploaded successfully!");

    // Reset form
    setForm({
      templateName: "",
      description: "",
      category: "",
      isPremium: false,
    });
    setPreviewImage(null);
    setTexFile(null);
    setClsFile(null);
    setAssets(null);

    // Fetch updated templates
    const updated = await axios.get("https://resume-craft-cswr.onrender.com/api/templates");
    setTemplates(updated.data);
  } catch (err: any) {
    setMessage("Upload failed: " + (err.response?.data?.message || err.message));
  }
};


  // Delete handler remains the same...

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Upload New Template</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="templateName"
          placeholder="Template Name"
          value={form.templateName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <label>
          Category:
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select a category</option>
            <option value="classy">Classy</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
            <option value="elegant">Elegant</option>
            <option value="creative">Creative</option>
          </select>
        </label>
        <label className="block">
          <input
            type="checkbox"
            name="isPremium"
            checked={form.isPremium}
            onChange={handleChange}
          />{" "}
          Premium Template
        </label>
        <label>
          Preview Image: <input type="file" accept="image/*" onChange={(e) => setPreviewImage(e.target.files?.[0] || null)} required />
        </label>
        <label>
          .tex File: <input type="file" accept=".tex" required onChange={(e) => setTexFile(e.target.files?.[0] || null)} />
        </label>
        <label>
          .cls File: <input type="file" accept=".cls" onChange={(e) => setClsFile(e.target.files?.[0] || null)} />
        </label>
        <label>
          Assets (images, etc): <input type="file" multiple onChange={(e) => setAssets(e.target.files)} />
        </label>
        <button type="submit" className="bg-violet text-white px-4 py-2 rounded">
          Upload Template
        </button>
      </form>

      {message && <div className="mt-4">{message}</div>}

      {/* Existing Templates Display (unchanged) */}
      <div className="mt-8">
  <h2 className="text-xl font-bold mb-4">All Templates</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {templates.map((template) => (
      <div
        key={template._id}
        className="relative bg-porcelain dark:bg-graphite rounded-lg border border-fog dark:border-ash/20 p-4 flex flex-col items-center"
      >
        {/* Delete (Cancel) Button */}
        <button
          onClick={async () => {
            if (window.confirm("Are you sure you want to delete this template?")) {
              try {
                await axios.delete(`http://localhost:5000/api/templates/${template._id}`, {
                  headers: {
                    "x-user-email": user.email, // or use your admin auth method
                  },
                });
                setTemplates((prev) => prev.filter((t) => t._id !== template._id));
              } catch (err) {
                alert("Failed to delete template.");
              }
            }
          }}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          title="Delete Template"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {/* Preview Image */}
        <img
          src={getPreviewImageUrl(template.previewImage)}
          alt={template.name}
          className="w-full h-40 object-cover rounded mb-2"
        />
        <h3 className="font-semibold text-ink dark:text-ash font-body text-lg mb-1">
          {template.name}
        </h3>
        <p className="text-slate dark:text-ash/80 text-sm mb-2 font-body">
          {template.description}
        </p>
        <span className="text-xs text-slate dark:text-ash/60">{template.type}</span>
      </div>
    ))}
  </div>
</div>
    </div>
  );
};


export default AdminTemplates; 