import express from "express";
import { searchCity } from "../controllers/LocationController";
const router = express.Router();

router.get("/location/search", searchCity);

export default router;
