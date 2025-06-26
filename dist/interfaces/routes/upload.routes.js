"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cloudinary_1 = require("../../infrastructure/services/cloudinary");
const router = express_1.default.Router();
router.post("/upload", cloudinary_1.upload.array("images"), (req, res) => {
    const imageUrls = req.files.map((file) => file.path);
    res.json({ imageUrls });
});
exports.default = router;
