import express from "express";
import type { Request, Response, NextFunction } from "express";
import type { ApiResponse, ApiErrorResponse } from "../../interfaces/api.js"
// import type { Trip } from "./types.js";
import { prisma } from "../../utils/prisma-only.js"
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { success } from "zod";
import { serializeBigInt } from "../../utils/serializeBigInt.js"
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// #region 「旅程資料」需要有的路由

// | GET | /api/plans | 讀取所有旅程 |
// | POST | /api/plans | 新增旅程 |
// | GET | /api/plans/:planId | 讀取單一旅程 |
// | PUT | /api/plans/:planId | 更新旅程 |
// | DELETE | /api/plans/:planId | 刪除旅程 |

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

async function authorizeTrip(userId: number, paramsPlanId: string) {
  // const userId = 2;
  const planId = Number(paramsPlanId);

  if (!planId || isNaN(planId)) throw new Error('沒有提供有效的旅程 ID');

  try {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) throw new Error('此筆旅程資料不存在');

    if (plan.userId !== BigInt(userId)) throw new Error('沒有權限操作此資料');

    return plan;

  } catch (err: any) {
    console.error('authorizeTrip error:', err);
    // 再拋出錯誤給上層 handler 處理
    throw new Error(err.message || '驗證旅程時發生錯誤');
  }
}

// | GET | /api/plans | 讀取所有旅程 |
router.get("/", async (req: Request, res: Response) => {
  const userId = getMemberIdFromToken(req);

  if (!userId) return res.status(404).json({ message: "沒有提供User ID" }) //之後有 JWT 驗證時拉掉

  try {
    const plans = await prisma.plan.findMany({
      where: {
        userId: userId,
        isDeleted: 0,
      },
      orderBy: [
        { startDate: 'desc' },  // 先依開始日期降冪
        { endDate: 'desc' }     // 開始日期相同時再依結束日期降冪
      ]
    })

    const response: ApiResponse = {
      success: true,
      message: "旅程查詢成功",
      data: serializeBigInt(plans)
    }
    res.status(200).json(response);
  } catch (err) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: (err as Error).message,
      message: "旅程查詢失敗，請稍後再試",
    }

    res.status(500).json(errorResponse);
  }
});

// | POST | /api/plans | 新增旅程 |
// router.post("/", async (req: Request, res: Response) => {
//   const userId = getMemberIdFromToken(req); //之後改為從 JWT 取 userID

//   if (!userId) return res.status(404).json({ message: "沒有提供User ID" }) //之後有 JWT 驗證時拉掉

//   try {
//     const {
//       title,
//       destination,
//       startDate,
//       startTimezone,
//       endDate,
//       endTimezone,
//       note,
//       coverImage,
//     } = req.body;

//     const newPlan = await prisma.plan.create({
//       data: {
//         userId,
//         title,
//         destination, //選填
//         startDate,
//         startTimezone,
//         endDate,
//         endTimezone,
//         note,  //選填
//         coverImage, //選填
//       },
//     });

//     const response: ApiResponse = {
//       success: true,
//       message: "旅程新增成功",
//       data: newPlan
//     }

//     res.status(201).json(response)
//   } catch (err) {
//     const errorResponse: ApiErrorResponse = {
//       success: false,
//       error: (err as Error).message,
//       message: "旅程新增失敗，請稍後再試",
//     }

//     res.status(500).json(errorResponse);
//   }
// });

// 設定封面圖片檔案存放位置
// 從專案根目錄算絕對路徑
const uploadPath = path.join(process.cwd(), "public/planner/cover");

// 確保資料夾存在
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("資料夾建立成功:", uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // 本機資料夾路徑
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("coverImage"), async (req: Request, res: Response) => {
  const userId = getMemberIdFromToken(req); // 之後改用 JWT

  if (!userId) return res.status(404).json({ message: "沒有提供User ID" });

  console.log("=== req.body ===");
  console.log(req.body);

  console.log("=== req.file ===");
  console.log(req.file);

  try {
    // 從 req.body 拿文字欄位
    const {
      title,
      destination,
      startDate,
      startTimezone,
      endDate,
      endTimezone,
      note,
    } = req.body;

    // 從 req.file 拿檔案資訊
    const coverImagePath = req.file
      ? `/planner/cover/${req.file.filename}`
      : null;

    const newPlan = await prisma.plan.create({
      data: {
        userId,
        title,
        destination,
        startDate,
        startTimezone,
        endDate,
        endTimezone,
        note,
        coverImage: coverImagePath, // 存檔案路徑
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "旅程新增成功",
      data: newPlan
    }

    res.status(201).json(response)
  } catch (err) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: (err as Error).message,
      message: "旅程新增失敗，請稍後再試",
    }

    res.status(500).json(errorResponse);
  }
});

// | GET | /api/plans/:planId | 讀取單一旅程 |
router.get('/:planId', async (req, res) => {
  const { planId } = req.params;
  const userId = getMemberIdFromToken(req); // TODO: 改成從 JWT 或 session 取得

  try {
    const plan = await authorizeTrip(userId, planId);

    const response: ApiResponse<null> = {
      success: true,
      message: '此 user 有權限查看此旅程',
      data: serializeBigInt(plan)
    };
    res.status(200).json(response);

  } catch (err: any) {
    const message = err.message || '驗證失敗';

    // 根據錯誤內容判斷正確 HTTP 狀態碼
    let status = 500;

    if (message.includes('旅程 ID')) status = 400;        // 無效 ID
    else if (message.includes('不存在')) status = 404;     // 找不到資料
    else if (message.includes('沒有權限')) status = 403;    // 沒有權限

    const errorResponse: ApiErrorResponse = {
      success: false,
      error: message,
      message: '此 user 沒有權限查看此旅程',
    };

    res.status(status).json(errorResponse);
  }
});

// | DELETE | /api/plans/:planId | 刪除旅程 |
router.delete('/:id', async (req: Request, res: Response) => {
  // console.log('有觸發刪除 API')

  try {
    // console.log('有進入 try')
    const userId = getMemberIdFromToken(req); //之後改為從 JWT 取 userID
    const planId = Number(req.params.id);
    // console.log(userId)
    // console.log(planId)

    // 驗證：(有沒有提供 userId)、有沒有提供 tripId、tripId 是不是數字
    if (!userId) throw new Error('沒有提供 User ID'); //之後有 JWT 驗證時拉掉
    if (!planId || isNaN(planId)) throw new Error('沒有提供有效的旅程 ID');

    // console.log('userId 為 Null，卻還在 try 的道路上')

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) throw new Error('此筆旅程資料不存在');

    if (String(plan.userId) !== String(userId)) {
      throw new Error("沒有權限刪除此資料");
    }

    await prisma.plan.update({
      where: { id: planId },
      data: { isDeleted: 1 },
    });

    const response: ApiResponse<null> = {
      success: true,
      message: '旅程刪除成功',
    };
    res.json(response);

  } catch (err: any) {
    // console.log('沒有 userId 進入 catch 了')
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: err.message || '系統錯誤，請再試一次',
      error: err.message || 'Unknown error',
    };
    res.status(500).json(errorResponse);
  };



});

// | PUT | /api/plans/:planId/cover | 更新封面圖片 |
router.put("/:id/cover", upload.single("cover"), async (req: Request, res: Response) => {
  try {
    // console.log('新的一個 req 開始，觸發了後端 API')
    const userId = getMemberIdFromToken(req);
    if (!userId) throw new Error('沒有提供 User ID');

    const tripId = Number(req.params.id);
    if (!tripId || isNaN(tripId)) throw new Error('沒有提供有效的旅程 ID');

    if (!req.file) throw new Error('沒有上傳檔案');

    // console.log(tripId)
    // console.log(req.file)
    // 最終檔案路徑（給 DB）
    const coverUrl = `/planner/cover/${req.file.filename}`;

    // 更新 DB
    await prisma.plan.update({
      where: { id: tripId },
      data: { coverImage: coverUrl },
    });

    // console.log('撈完了資料庫')
    // console.log(coverUrl)

    const response: ApiResponse = {
      success: true,
      message: '旅程刪除成功',
      data: {
        coverImage: coverUrl
      }
    };
    res.status(201).json(response);
    // console.log('回應了成功的 res')

  } catch (err: any) {
    // console.log('走到了錯誤')
    console.error(err);

    const errorResponse: ApiErrorResponse = {
      success: false,
      error: err,
      message: '上傳圖片失敗',
    };

    res.status(500).json(errorResponse);
  }
});

export default router;