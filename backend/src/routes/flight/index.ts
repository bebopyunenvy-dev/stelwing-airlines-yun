import express from "express";
import { prisma } from "../../utils/prisma-only.js";

const router = express.Router();

// 讀取所有航班
router.get("/", async (req, res) => {
  try {
    const flights = await prisma.flight.findMany({
      orderBy: { flightDate: "asc" },
    });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 新增航班
router.post("/add", async (req, res) => {
  try {
    const {
      flightNumber,
      flightDate,
      originIata,
      destinationIata,
      depTimeUtc,
      arrTimeUtc,
      status,
    } = req.body;

    const newFlight = await prisma.flight.create({
      data: {
        flightNumber,
        flightDate: new Date(flightDate),
        originIata,
        destinationIata,
        depTimeUtc: new Date(depTimeUtc),
        arrTimeUtc: new Date(arrTimeUtc),
        status,
      },
    });

    res.status(201).json({
      success: true,
      message: "航班建立成功",
      data: newFlight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "建立失敗",
      error: (err as Error).message,
    });
  }
});

export default router;
