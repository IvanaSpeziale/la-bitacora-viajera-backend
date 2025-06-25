import express from "express";
import multer from "multer";
import {
  createJournalEntryController,
  getJournalEntriesController,
  getJournalEntryByIdController,
  updateJournalEntryController,
  deleteJournalEntryController,
  getJournalEntriesByUserController,
} from "../controllers/TravelJournalController";
import { authMiddleware } from "../../middlewares/authMiddleware";
import fs from "fs";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

router.post(
  "/journal-entries/create",
  authMiddleware,
  upload.array("files"),
  createJournalEntryController
);
router.get("/journal-entries", authMiddleware, getJournalEntriesController);
router.get(
  "/journal-my-entries/user",
  authMiddleware,
  getJournalEntriesByUserController
);
router.get(
  "/journal-entries/:id",
  authMiddleware,
  getJournalEntryByIdController
);
router.put(
  "/journal-entries/:id",
  authMiddleware,
  upload.array("files"),
  updateJournalEntryController
);
router.delete(
  "/journal-entries/:id",
  authMiddleware,
  deleteJournalEntryController
);

export default router;
