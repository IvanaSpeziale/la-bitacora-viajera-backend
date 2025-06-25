import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { validate as isUuid } from "uuid";

import {
  CreateJournalEntry,
  GetJournalEntries,
  GetJournalEntryById,
  UpdateJournalEntry,
  DeleteJournalEntry,
  GetJournalEntriesByUser,
} from "../../application/use-cases/travel-journal/JournalEntryUseCases";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

export const createJournalEntryController = async (
  req: any,
  res: any
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const {
      locations,
      date,
      description,
      dailyExpenses,
      favorite,
      leastFavorite,
      score,
    } = req.body;

    console.log("Datos recibidos:", req.body); // Log para depurar
    console.log("Archivos recibidos:", req.files); // Log para depurar

    let processedLocations: any[] = [];
    try {
      const parsedLocations = JSON.parse(locations); // Parsear locations si es un string
      if (Array.isArray(parsedLocations)) {
        processedLocations = parsedLocations;
      } else if (parsedLocations && typeof parsedLocations === "object") {
        processedLocations = [parsedLocations];
      } else {
        throw new Error(
          "El campo 'locations' debe ser un array o un objeto válido"
        );
      }
    } catch (error) {
      res.status(400).json({
        message: "El campo 'locations' debe ser un array o un objeto válido",
      });
      return;
    }

    // Subir imágenes a Cloudinary
    const imageUrls: string[] = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "bitacora-viajera",
          fetch_format: "auto",
        });
        imageUrls.push(result.secure_url); // Guardar la URL segura de la imagen
      }
    }

    const newEntry = {
      id: uuidv4(),
      userId,
      locations: processedLocations,
      date,
      description,
      dailyExpenses,
      favorite,
      leastFavorite,
      score,
      imageUrls,
    };

    const savedEntry = await CreateJournalEntry(newEntry);
    res.status(201).json(savedEntry);
  } catch (error) {
    console.error("Error al crear la entrada de la bitácora:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getJournalEntriesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const entries = await GetJournalEntries();
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error al obtener las entradas de la bitácora:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getJournalEntryByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log("ID recibido en el controlador:", id);
    if (!id) {
      res.status(400).json({ message: "El parámetro 'id' es requerido" });
      return;
    }

    const entry = await GetJournalEntryById(id);
    res.status(200).json(entry);
  } catch (error) {
    console.error("Error al obtener la entrada de la bitácora:", error);
    res.status(404).json({ message: error });
  }
};

export const updateJournalEntryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log("ID recibido para actualizar:", id);
    const updates = req.body;

    console.log("Datos recibidos en el cuerpo:", req.body);
    console.log("Archivos recibidos:", req.files);

    if (!id) {
      res.status(400).json({ message: "El parámetro 'id' es requerido" });
      return;
    }

    if (!isUuid(id)) {
      res
        .status(400)
        .json({ message: "El ID proporcionado no es un UUID válido" });
      return;
    }

    // Validar si updates existe antes de procesar locations
    if (!updates) {
      res.status(400).json({
        message: "El cuerpo de la solicitud está vacío o es inválido",
      });
      return;
    }

    // Procesar locations
    let processedLocations: any[] = [];
    if (updates.locations) {
      try {
        const parsedLocations = JSON.parse(updates.locations); // Parsear locations si es un string
        if (Array.isArray(parsedLocations)) {
          processedLocations = parsedLocations;
        } else if (parsedLocations && typeof parsedLocations === "object") {
          processedLocations = [parsedLocations];
        } else {
          throw new Error(
            "El campo 'locations' debe ser un array o un objeto válido"
          );
        }
      } catch (error) {
        res.status(400).json({
          message: "El campo 'locations' debe ser un array o un objeto válido",
        });
        return;
      }
    }

    // Subir imágenes a Cloudinary
    const imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "bitacora-viajera",
            fetch_format: "auto",
          });
          imageUrls.push(result.secure_url); // Guardar la URL segura de la imagen
        } catch (error) {
          console.error("Error al subir la imagen a Cloudinary:", error);
          res.status(500).json({
            message: "Error al subir las imágenes",
          });
          return;
        }
      }
    }

    const updatedEntry = await UpdateJournalEntry(id, {
      ...updates,
      locations: processedLocations.length > 0 ? processedLocations : undefined,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
    });
    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error("Error al actualizar la entrada de la bitácora:", error);
    res.status(404).json({ message: error });
  }
};

export const deleteJournalEntryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "El parámetro 'id' es requerido" });
      return;
    }

    await DeleteJournalEntry(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar la entrada de la bitácora:", error);
    res.status(404).json({ message: error });
  }
};

export const getJournalEntriesByUserController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("Entrando al controlador getJournalEntriesByUserController");
    const userId = req.user?.id;

    console.log("Usuario autenticado:", req.user);

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const entries = await GetJournalEntriesByUser(userId);
    res.status(200).json(entries);
  } catch (error) {
    console.error(
      "Error al obtener las entradas de la bitácora por usuario:",
      error
    );
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
