
import { Router } from "express";
import airportsRouter from "./airports.js";
import flightsRouter from "./flights.js";

const router = Router();

// /api/flight-search/airports?query=TPE
router.use("/airports", airportsRouter);

// /api/flight-search/flights/search?origin=TPE&destination=NRT&depart=2025-12-10
router.use("/flights", flightsRouter);

export default router;
