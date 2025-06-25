import axios from "axios";
import { Request, Response } from "express";

export const searchCity = async (req: Request, res: Response) => {
  console.log(
    "Solicitud recibida en /location/search con query:",
    req.query.query
  );

  const { query } = req.query;
  if (!query) {
    res.status(400).json({ message: "El parámetro 'query' es requerido" });
    return;
  }

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
        headers: {
          "User-Agent": "la-bitacora-viajera/1.0",
        },
      }
    );

    if (!Array.isArray(response.data)) {
      res
        .status(500)
        .json({ message: "La respuesta de OpenStreetMap no es válida" });
      return;
    }

    const results = response.data.map((item: any) => ({
      name: item.name,
      lat: item.lat,
      lon: item.lon,
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar ciudad" });
  }
};
