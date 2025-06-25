import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from "../controllers/AdminController";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adminMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, adminMiddleware, getUserById);
router.put("/users/:id/role", authMiddleware, adminMiddleware, updateUserRole);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;
