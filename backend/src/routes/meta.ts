import { Router } from 'express';
import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();
const router = Router();

router.get('/locations', async (_req, res) => {
  try {
    const countries = await prisma.country.findMany({
      select: {
        countryId: true,
        countryCode: true,
        countryName: true,
        cities: {
          select: {
            cityId: true,
            cityName: true,
            airports: {
              select: {
                airportCode: true, // IATA
                airportName: true,
              },
              orderBy: { airportCode: 'asc' },
            },
          },
          orderBy: { cityName: 'asc' },
        },
      },
      orderBy: { countryName: 'asc' },
    });

    // 整理成前端可用的簡潔 JSON
    const payload = countries.map((c) => ({
      countryId: String(c.countryId),
      countryCode: c.countryCode,
      countryName: c.countryName,
      cities: c.cities.map((ci) => ({
        cityId: String(ci.cityId),
        cityName: ci.cityName,
        airports: ci.airports.map((a) => ({
          code: a.airportCode,
          name: a.airportName,
        })),
      })),
    }));

    res.json({ countries: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

export default router;
