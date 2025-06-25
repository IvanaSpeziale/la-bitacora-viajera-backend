const express = require("express");
const router = express.Router();
import { authMiddleware } from "../../middlewares/authMiddleware";
import { getTrendingActivities } from "../controllers/GetTrendingActivitiesController";
import * as nextDestinationController from "../controllers/NextDestination.controller";
router.get(
  "/me",
  authMiddleware,
  nextDestinationController.getMyNextDestinations
);
router.get(
  "/:id",
  authMiddleware,
  nextDestinationController.getNextDestinationById
);
router.post(
  "/create",
  authMiddleware,
  nextDestinationController.createNextDestination
);
router.put(
  "/:id",
  authMiddleware,
  nextDestinationController.updateNextDestination
);
router.delete(
  "/:id",
  authMiddleware,
  nextDestinationController.deleteNextDestination
);
router.post("/destination-trends", getTrendingActivities);

export default router;
