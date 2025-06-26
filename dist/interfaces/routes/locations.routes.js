"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LocationController_1 = require("../controllers/LocationController");
const router = express_1.default.Router();
router.get("/location/search", LocationController_1.searchCity);
exports.default = router;
