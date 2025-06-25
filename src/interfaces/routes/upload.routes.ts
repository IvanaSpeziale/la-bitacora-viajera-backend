import express from "express";
import { upload } from "../../infrastructure/services/cloudinary";

const router = express.Router();

router.post("/upload", upload.array("images"), (req, res) => {
  const imageUrls = (req.files as Express.Multer.File[]).map(
    (file) => file.path
  );
  res.json({ imageUrls });
});

export default router;
