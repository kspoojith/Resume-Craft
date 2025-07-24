import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const id = req.body.uuid || uuid(); // frontend should send uuid or generate here
    const dir = path.join('tmp', id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // retain original filenames like resume.cls etc.
  }
});

const upload = multer({ storage });

router.post('/upload', upload.array('files'), (req, res) => {
  res.json({ message: 'Files uploaded successfully', uuid: req.body.uuid });
});

export default router;
