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
exports.ContentModerationService = void 0;
const axios_1 = __importDefault(require("axios"));
class ContentModerationService {
    static hasOfensiveLanguage(texto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const response = yield axios_1.default.post("https://api.openai.com/v1/chat/completions", {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Sos un moderador que detecta si un texto contiene insultos o lenguaje ofensivo.",
                        },
                        { role: "user", content: texto },
                    ],
                    temperature: 0.2,
                }, {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                });
                const resultado = response.data.choices[0].message.content.toLowerCase();
                return (resultado.includes("sí") ||
                    resultado.includes("insulto") ||
                    resultado.includes("ofensivo"));
            }
            catch (error) {
                console.error("Error al procesar la solicitud:", (axios_1.default.isAxiosError(error) ? (_a = error.response) === null || _a === void 0 ? void 0 : _a.data : null) ||
                    error.message);
                return false;
            }
        });
    }
}
exports.ContentModerationService = ContentModerationService;
