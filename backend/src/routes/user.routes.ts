import express from "express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma-only.js"
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// #region 「會員資料本身」需要有的路由

// 會員資料、里程數等等

// #endregion

export default router;