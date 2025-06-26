"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const TravelJournalController_1 = require("../controllers/TravelJournalController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, "../../uploads/");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/journal-entries/create", authMiddleware_1.authMiddleware, upload.array("files"), TravelJournalController_1.createJournalEntryController);
router.get("/journal-entries", authMiddleware_1.authMiddleware, TravelJournalController_1.getJournalEntriesController);
router.get("/journal-my-entries/user", authMiddleware_1.authMiddleware, TravelJournalController_1.getJournalEntriesByUserController);
router.get("/journal-entries/:id", authMiddleware_1.authMiddleware, TravelJournalController_1.getJournalEntryByIdController);
router.put("/journal-entries/:id", authMiddleware_1.authMiddleware, upload.array("files"), TravelJournalController_1.updateJournalEntryController);
router.delete("/journal-entries/:id", authMiddleware_1.authMiddleware, TravelJournalController_1.deleteJournalEntryController);
exports.default = router;
