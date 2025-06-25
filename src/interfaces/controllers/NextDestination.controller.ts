import {
  GetNextDestinationsByUser,
  GetNextDestinationById,
  CreateNextDestination,
  UpdateNextDestination,
  DeleteNextDestination,
} from "../../application/use-cases/next-destination/NextDestinationUseCases";
import { NextDestinationDTO } from "../../domain/dtos/NextDestinationDTO";

export const getMyNextDestinations = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const destinations = await GetNextDestinationsByUser(userId);
    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching next destinations:", error);
    res.status(500).json({ message: "Error fetching next destinations" });
  }
};

export const getNextDestinationById = async (req: any, res: any) => {
  try {
    const destinationId = req.params.id;
    if (!destinationId) {
      res.status(400).json({ message: "El ID del destino es requerido" });
      return;
    }

    const destination = await GetNextDestinationById(
      destinationId,
      req.user?.id
    );
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json(destination);
  } catch (error) {
    console.error(
      `Error fetching destination with id ${req.params.id}:`,
      error
    );
    res.status(500).json({ message: "Error fetching destination" });
  }
};

export const createNextDestination = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const { name, targetDate } = req.body;

    const nextDestinationDTO: NextDestinationDTO = {
      name,
      targetDate: new Date(targetDate),
      createdDate: new Date(),
    };

    const newDestination = await CreateNextDestination(
      nextDestinationDTO.name,
      nextDestinationDTO.targetDate,
      nextDestinationDTO.createdDate,
      userId
    );

    res.status(201).json(newDestination);
  } catch (error) {
    console.error("Error al crear el destino:", error);
    res.status(500).json({ message: "Error al crear el destino" });
  }
};

export const updateNextDestination = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const { name, targetDate } = req.body;

    const nextDestinationDTO: NextDestinationDTO = {
      name,
      targetDate: new Date(targetDate),
      createdDate: new Date(),
    };

    const updatedDestination = await UpdateNextDestination(
      req.params.id,
      nextDestinationDTO.name,
      nextDestinationDTO.targetDate,
      userId
    );
    if (!updatedDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json(updatedDestination);
  } catch (error) {
    console.error(
      `Error updating destination with id ${req.params.id}:`,
      error
    );
    res.status(500).json({ message: "Error updating destination" });
  }
};

export const deleteNextDestination = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    await DeleteNextDestination(req.params.id, userId);
    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error(
      `Error deleting destination with id ${req.params.id}:`,
      error
    );
    res.status(500).json({ message: "Error deleting destination" });
  }
};
