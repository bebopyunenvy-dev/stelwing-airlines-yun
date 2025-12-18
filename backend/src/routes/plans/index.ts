import { Router } from "express";
import plansRouter from "./plans.routes.js";
import itemsRouter from "./items.routes.js";
import categoriesRouter from "./categories.routes.js";

const router = Router();

router.use("/", plansRouter);                   // /api/plans
router.use("/:planId/items", itemsRouter);      // /api/plans/:planId/items
router.use("/:planId/categories", categoriesRouter); // /api/plans/:planId/categories

export default router;