import express from "express";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma-only.js"
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

// #region 「會員資料本身」需要有的路由

// | GET | /api/plans/:planId/categories | 讀取該旅程所有分類 |
// | POST | /api/plans/:planId/categories | 新增分類 |
// | GET | /api/plans/:planId/categories/:categoryId | 讀取單一分類 |
// | PUT | /api/plans/:planId/categories/:categoryId | 更新分類（例如顏色或名稱） |
// | DELETE | /api/plans/:planId/categories/:categoryId | 刪除分類 |

// #endregion

export default router;