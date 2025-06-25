import { NextDestination } from "../../domain/entities/NextDestination";
// const pool = require("./db");
import pool from "./db";

const createNextDestinationTable = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS next_destinations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      target_date TIMESTAMP NOT NULL
    );
  `);
};

const getNextDestinationsByUser = async (userId: string): Promise<NextDestination[]> => {
  const result = await pool.query(
    "SELECT * FROM next_destinations WHERE user_id = $1;",
    [userId]
  );
  return result.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    targetDate: new Date(row.target_date),
    createdDate: new Date(row.created_date),
  }));
};

const getNextDestinationById = async (
  id: number,
  userId: string
): Promise<NextDestination | null> => {
  const result = await pool.query(
    "SELECT * FROM next_destinations WHERE id = $1 AND user_id = $2;",
    [id, userId]
  );
  if (result.rows.length === 0) {
    return null;
  }
  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    targetDate: new Date(row.target_date),
    createdDate: new Date(row.created_date),
  };
};

const createNextDestination = async (
  name: string,
  targetDate: Date,
  createdDate: Date,
  userId: string
): Promise<NextDestination> => {
  const result = await pool.query(
    "INSERT INTO next_destinations (name, target_date, created_date, user_id) VALUES ($1, $2, $3, $4) RETURNING *;",
    [name, targetDate, createdDate, userId]
  );
  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    targetDate: new Date(row.target_date),
    createdDate: new Date(row.created_date),
  };
};

const updateNextDestination = async (
  id: number,
  name: string,
  targetDate: Date,
  userId: string
): Promise<NextDestination | null> => {
  const result = await pool.query(
    "UPDATE next_destinations SET name = $1, target_date = $2 WHERE id = $3 AND user_id = $4 RETURNING *;",
    [name, targetDate, id, userId]
  );
  if (result.rows.length === 0) {
    return null;
  }
  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    targetDate: new Date(row.target_date),
    createdDate: new Date(row.created_date),
  };
};

const deleteNextDestination = async (id: number, userId: string): Promise<void> => {
  await pool.query("DELETE FROM next_destinations WHERE id = $1 AND user_id = $2;", [id, userId]);
};

export {
  createNextDestinationTable,
  getNextDestinationsByUser,
  getNextDestinationById,
  createNextDestination,
  updateNextDestination,
  deleteNextDestination,
};
