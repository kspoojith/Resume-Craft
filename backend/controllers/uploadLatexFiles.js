import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uuid = req.body.uuid;
    const uploadDir = path.join('templates', 'uploads', uuid); // <-- FIXED
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // keep original file name
  },
});

const upload = multer({ storage }).array('files', 20); // allow multiple

export const uploadLatexFiles = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(500).json({ message: 'File upload failed' });
    }
    return res.status(200).json({ message: 'Files uploaded successfully' });
  });
};
