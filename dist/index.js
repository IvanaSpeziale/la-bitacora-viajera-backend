"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_routes_1 = __importDefault(require("./interfaces/routes/account.routes"));
const auth_routes_1 = __importDefault(require("./interfaces/routes/auth.routes"));
const user_routes_1 = __importDefault(require("./interfaces/routes/user.routes"));
const locations_routes_1 = __importDefault(require("./interfaces/routes/locations.routes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const myTravelJournal_routes_1 = __importDefault(require("./interfaces/routes/myTravelJournal.routes"));
const upload_routes_1 = __importDefault(require("./interfaces/routes/upload.routes"));
const nextDestination_routes_1 = __importDefault(require("./interfaces/routes/nextDestination.routes"));
const admin_routes_1 = __importDefault(require("./interfaces/routes/admin.routes"));
/// <reference path="./types/express/index.d.ts" />
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://la-bitacora-viajera-ds65-git-main-ivana-speziales-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(`Solicitud entrante: ${req.method} ${req.url}`);
    next();
});
const PORT = process.env.PORT || 3002;
app.use("/", auth_routes_1.default);
app.use("/user", user_routes_1.default);
app.use("/accounts", account_routes_1.default);
app.use("/", myTravelJournal_routes_1.default);
app.use("/", locations_routes_1.default);
app.use("/upload", upload_routes_1.default);
app.use("/next-destinations", nextDestination_routes_1.default);
app.use("/admin", admin_routes_1.default);
app.get("/", (req, res) => {
    res.send("La Bitácora Viajera API activa 🧭");
});
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
