import { Router, type Request, type Response } from "express";
import { PrismaClient } from "../../generated/prisma/index.js";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const QuerySchema = z.object({
  query: z.string().trim().min(1, "query is required"),
});

router.get('/', async (_req, res) => {
  try {
    const airports = await prisma.airport.findMany({
      select: {
        airportId: true,
        airportCode: true,
        airportName: true,
        city: {
          select: {
            cityName: true,
            country: { select: { countryCode: true } },
          },
        },
      },
      orderBy: { airportCode: 'asc' },
    });

    const dto = airports.map((a) => ({
      id: a.airportId,
      iata: a.airportCode,
      name: a.airportName,
      city: a.city?.cityName ?? '',
      countryCode: a.city?.country?.countryCode ?? '',
    }));

    res.json(dto);
  } catch (e) {
    console.error('airports list error', e);
    res.status(500).json([]);
  }
});

export default router;

