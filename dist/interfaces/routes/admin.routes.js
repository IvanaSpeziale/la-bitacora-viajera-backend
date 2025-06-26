"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminController_1 = require("../controllers/AdminController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const authMiddleware_2 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/users", authMiddleware_1.authMiddleware, authMiddleware_2.adminMiddleware, AdminController_1.getAllUsers);
router.get("/users/:id", authMiddleware_1.authMiddleware, authMiddleware_2.adminMiddleware, AdminController_1.getUserById);
router.put("/users/:id/role", authMiddleware_1.authMiddleware, authMiddleware_2.adminMiddleware, AdminController_1.updateUserRole);
router.delete("/users/:id", authMiddleware_1.authMiddleware, authMiddleware_2.adminMiddleware, AdminController_1.deleteUser);
exports.default = router;
