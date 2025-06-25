import express from "express";
import { getAccountDetails } from "../controllers/AccountController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/me", authMiddleware, getAccountDetails);

export default router;
