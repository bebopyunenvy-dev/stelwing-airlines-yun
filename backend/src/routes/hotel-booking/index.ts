// 檔案：src/routes/hotel-booking/index.ts

import { Router } from "express";
import { z } from "zod";
// 假設您的 validate 中介層路徑為 ../../middleware/validate.js
import { validate } from "../../middleware/validate.js";
// 假設您的 asyncHandler 路徑為 ../../utils/http.js 或 ../../utils/https.js
import { asyncHandler } from "../../utils/https.js";
// 假設您的 jwtRequired 中介層路徑為 ../../middleware/auth.js
import { jwtRequired } from "../../middleware/auth.js";
import {
  listHotels,
  getHotelDetail,
  createHotelBooking,
} from "./hotel.controller.js"; // 假設控制器與路由在同一資料夾下

const router: Router = Router();

// Zod Schema for listHotels query (匹配您的前端篩選器)
const listHotelsQuerySchema = z.object({
  location: z.string().optional(),
  minPrice: z.coerce.number().int().optional(),
  maxPrice: z.coerce.number().int().optional(),
  amenities: z.string().optional(), // 'wifi,parking'
  rating: z.coerce.number().min(0).max(5).optional(),
});

// Zod Schema for booking body
const bookingBodySchema = z.object({
  roomType: z.string(),
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
  totalPrice: z.number().int().min(0),
});

// 1. 搜尋飯店列表 (GET /api/hotels)
router.get(
  "/",
  validate({ query: listHotelsQuerySchema }),
  asyncHandler(listHotels)
);

// 2. 飯店詳情 (GET /api/hotels/:id)
router.get(
  "/:id",
  validate({ params: z.object({ id: z.coerce.number().int() }) }),
  asyncHandler(getHotelDetail)
);

// 3. 建立飯店預訂 (POST /api/hotels/:id/booking)
router.post(
  "/:id/booking",
  jwtRequired, // 需要登入
  validate({
    params: z.object({ id: z.coerce.number().int() }),
    body: bookingBodySchema,
  }),
  asyncHandler(createHotelBooking)
);

// 導出路由以供主路由文件使用 (例如：在 src/routes/index.ts 中使用 app.use('/hotels', hotelBookingRouter))
export default router;
