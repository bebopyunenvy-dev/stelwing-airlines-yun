// 檔案：src/routes/api.ts (假設這是您的 API 總機)

import { Router } from "express";
// ... 其他路由導入 ...
import hotelBookingRouter from "./hotel-booking/index.js"; // 引入新模組

const api: Router = Router();

// ... 其他路由保持不變 ...

// 掛載飯店預訂模組，假設最終路徑為 /api/hotels
api.use("/hotels", hotelBookingRouter);

export default api;