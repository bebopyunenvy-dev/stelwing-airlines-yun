import express from "express";
import type { Request, Response, NextFunction } from "express";
import type { ApiResponse, ApiErrorResponse } from "../../interfaces/api.js";
import { prisma } from "../../utils/prisma-only.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { serializeBigInt } from "../../utils/serializeBigInt.js";
import jwt from "jsonwebtoken";

const router = express.Router({ mergeParams: true });
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// #region 「每日行程」需要有的路由

// | GET | /api/plans/:planId/items | 讀取所有行程項目 |
// | POST | /api/plans/:planId/items | 新增行程項目 |
// | GET | /api/plans/:planId/items/:itemId | 讀取單一行程 |
// | PUT | /api/plans/:planId/items/:itemId | 更新單一行程 |
// | DELETE | /api/plans/:planId/items/:itemId | 刪除單一行程 |

// #endregion

function getMemberIdFromToken(req: Request) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return null;
    try {
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "string") return null;
        return decoded.memberId;
    } catch {
        return null;
    }
}

// | GET | /api/plans/:planId/items | 讀取所有行程項目 |
router.get("/", async (req: Request, res: Response) => {
    const { planId } = req.params as { planId: string };
    if (!planId) throw new Error('沒有提供旅程 ID');
    if (!/^\d+$/.test(planId)) throw new Error('沒有提供有效的旅程 ID');

    const planIdNum = BigInt(planId);
    const userId = getMemberIdFromToken(req);

    try {
        const planItems = await prisma.planItem.findMany({
            where: {
                planId: planIdNum,
                isDeleted: 0,
            },
            orderBy: [
                { startTime: "desc" },
                { endTime: "desc" },
            ],
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        bgColor: true,
                        textColor: true,
                    }
                }
            }
        });

        const response: ApiResponse = {
            success: true,
            message: "行程查詢成功",
            data: serializeBigInt(planItems),
        };
        res.status(200).json(response);
    } catch (err) {
        const errorResponse: ApiErrorResponse = {
            success: false,
            error: (err as Error).message,
            message: "行程查詢失敗，請稍後再試",
        };

        res.status(500).json(errorResponse);
    }
});

// | POST | /api/plans/:planId/items | 新增行程項目 |
router.post("/", async (req: Request, res: Response) => {
    const userId = getMemberIdFromToken(req); //之後改為從 JWT 取 userID

    const { planId } = req.params as { planId: string };
    if (!planId) throw new Error('沒有提供旅程 ID');
    if (!/^\d+$/.test(planId)) throw new Error('沒有提供有效的旅程 ID');

    const planIdNum = BigInt(planId);

    try {
        const {
            title,
            allDay,
            startTime,
            startTimezone,
            // startDate,
            endTime,
            endTimezone,
            // endDate,
            note,
            locationTextchar,
            locationUrl,
            typeId,
        } = req.body;

        const newPlanItem = await prisma.planItem.create({
            data: {
                title,
                allDay,
                startTime,
                startTimezone,
                // startDate,
                endTime,
                endTimezone,
                // endDate,
                note,
                locationTextchar,
                locationUrl,
                plan: { connect: { id: planIdNum } },
                category: typeId
                    ? { connect: { id: typeId } }  // 如果有選分類就 connect
                    : undefined,                  // 沒選分類就留空
            },
        });

        console.log(newPlanItem)

        const response: ApiResponse = {
            success: true,
            message: "行程新增成功",
            data: newPlanItem
        };

        console.log('後端有成功新增行程')

        res.status(201).json(response);
    } catch (err) {
        console.log('後端新增行程進錯誤')
        console.log(err)
        const errorResponse: ApiErrorResponse = {
            success: false,
            error: (err as Error).message,
            message: "行程新增失敗，請稍後再試",
        }

        res.status(500).json(errorResponse);
    }
});

export default router;
