import express from "express";
import accountRoutes from "./interfaces/routes/account.routes";
import authRoutes from "./interfaces/routes/auth.routes";
import userRoutes from "./interfaces/routes/user.routes";
import locationRoutes from "./interfaces/routes/locations.routes";
import cors from "cors";
import dotenv from "dotenv";
import myTravelJournalRoutes from "./interfaces/routes/myTravelJournal.routes";
import uploadRoutes from "./interfaces/routes/upload.routes";
import nextDestinationRoutes from "./interfaces/routes/nextDestination.routes";
import adminRoutes from "./interfaces/routes/admin.routes";

/// <reference path="./types/express/index.d.ts" />

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Solicitud entrante: ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 3002;
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/accounts", accountRoutes);
app.use("/", myTravelJournalRoutes);
app.use("/", locationRoutes);
app.use("/upload", uploadRoutes);
app.use("/next-destinations", nextDestinationRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
