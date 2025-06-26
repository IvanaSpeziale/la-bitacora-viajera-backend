"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/me", authMiddleware_1.authMiddleware, UserController_1.getUserDetails);
router.put("/:id", authMiddleware_1.authMiddleware, UserController_1.updateUserDetails);
exports.default = router;
