import {
  getNextDestinationsByUser,
  getNextDestinationById,
  createNextDestination,
  updateNextDestination,
  deleteNextDestination,
} from "../../../infrastructure/database/NextDestinationRepository";
import { NextDestination } from "../../../domain/entities/NextDestination";

export async function GetNextDestinationsByUser(
  userId: string
): Promise<NextDestination[]> {
  return await getNextDestinationsByUser(userId);
}

export async function GetNextDestinationById(
  id: string,
  userId: string
): Promise<NextDestination | null> {
  const destination = await getNextDestinationById(Number(id), userId);
  if (!destination) {
    throw new Error(`El destino con ID ${id} no existe o no pertenece al usuario.`);
  }
  return destination;
}

export async function CreateNextDestination(
  name: string,
  targetDate: Date,
  createdDate: Date,
  userId: string
): Promise<NextDestination> {
  return await createNextDestination(name, targetDate, createdDate, userId);
}

export async function UpdateNextDestination(
  id: string,
  name: string,
  targetDate: Date,
  userId: string
): Promise<NextDestination | null> {
  const updatedDestination = await updateNextDestination(
    Number(id),
    name,
    targetDate,
    userId
  );
  if (!updatedDestination) {
    throw new Error(`El destino con ID ${id} no existe o no pertenece al usuario.`);
  }
  return updatedDestination;
}

export async function DeleteNextDestination(id: string, userId: string): Promise<void> {
  const destination = await getNextDestinationById(Number(id), userId);
  if (!destination) {
    throw new Error(`El destino con ID ${id} no existe o no pertenece al usuario.`);
  }
  await deleteNextDestination(Number(id), userId);
}
