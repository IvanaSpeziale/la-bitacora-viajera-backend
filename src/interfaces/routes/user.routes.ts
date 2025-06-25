import express from "express";
import {
  getUserDetails,
  updateUserDetails,
} from "../controllers/UserController";
import { authMiddleware } from "../../middlewares/authMiddleware";
const router = express.Router();

router.get("/me", authMiddleware, getUserDetails);

router.put("/:id", authMiddleware, updateUserDetails);

export default router;
