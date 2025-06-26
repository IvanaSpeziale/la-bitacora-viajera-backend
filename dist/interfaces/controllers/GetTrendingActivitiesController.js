"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrendingActivities = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const getTrendingActivities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { destination } = req.body;
    if (!destination) {
        return res.status(400).json({ error: "Destination is required" });
    }
    try {
        const prompt = `What are the trending activities in ${destination}?`;
        const completion = yield openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
        });
        const responseText = ((_a = completion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) || "";
        return res.json({ activities: responseText });
    }
    catch (error) {
        console.error("OpenAI Error:", error);
        return res
            .status(500)
            .json({ error: "Error fetching activities from OpenAI" });
    }
});
exports.getTrendingActivities = getTrendingActivities;
