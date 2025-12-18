// 檔案：src/routes/hotel-booking/hotel.controller.ts

import type { Request, Response } from "express";
// 假設您的 prisma client 路徑為 ../../utils/prisma.js 或相應路徑
import { prisma } from "../../utils/prisma.js";
import { AppError } from "../../utils/https.js";

// --- 輔助函式：將 Prisma 結果轉換為前端 HotelCardData 結構 ---
// 確保您的 Hotel 模型 (HotelModel) 欄位與此處匹配
function mapToHotelCardData(hotel: any) {
  return {
    id: hotel.id,
    name: hotel.name,
    // ... (其他您需要的 HotelCardData 欄位)
    rating: hotel.rating,
    price: hotel.price,
    location: hotel.location,
    image: hotel.images?.[0] || "default-image.jpg",
    amenities: hotel.amenityKeys,
    busFree: hotel.busFree,
    lat: hotel.lat,
    lng: hotel.lng,
    // ...
  };
}

// 1. 搜尋飯店列表 (GET /)
export async function listHotels(req: Request, res: Response) {
  const { location, minPrice, maxPrice, amenities, rating } = req.query as any;

  let where: any = {};

  // 實作篩選邏輯 (與上一個回答相同)
  const minP = minPrice ? parseInt(minPrice) : undefined;
  const maxP = maxPrice ? parseInt(maxPrice) : undefined;
  if (minP !== undefined || maxP !== undefined) {
    where.price = { gte: minP, lte: maxP };
  }

  if (location) {
    where.OR = [
      { name: { contains: location, mode: "insensitive" } },
      { address: { contains: location, mode: "insensitive" } },
    ];
  }

  if (amenities) {
    const amenityArray = amenities
      .split(",")
      .map((a: string) => a.trim().toUpperCase());
    where.amenityKeys = { hasEvery: amenityArray };
  }

  if (rating) {
    where.rating = { gte: parseFloat(rating) };
  }

  // 執行查詢
  const hotels = await prisma.hotel.findMany({ where });

  const result = hotels.map(mapToHotelCardData);

  res.json({ success: true, hotels: result });
}

// 2. 取得單一飯店詳情 (GET /:id)
export async function getHotelDetail(req: Request, res: Response) {
  const id = parseInt(req.params.id);

  const hotel = await prisma.hotel.findUnique({
    where: { id },
  });

  if (!hotel) {
    throw new AppError(404, "Hotel not found");
  }

  // 轉換資料結構
  const detailData = {
    ...hotel,
    amenityKeys: hotel.amenityKeys.map((key) => String(key).toLowerCase()),
  };

  res.json({ success: true, hotel: detailData });
}

// 3. 建立飯店預訂 (POST /:id/booking)
export async function createHotelBooking(req: Request, res: Response) {
  // ⚠️ 確保您的 JWT 中介層將使用者 ID 掛載到 req.user.id
  const userId = req.user!.id;
  const hotelId = parseInt(req.params.id);

  const { roomType, checkInDate, checkOutDate, totalPrice } = req.body;

  // 驗證飯店和日期區間 (簡化，假設前端已計算好 totalPrice)
  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel) {
    throw new AppError(404, "Hotel not found for booking");
  }

  // 實際業務中需要：檢查庫存、價格驗證...

  // 創建訂單
  const newBooking = await prisma.hotelBooking.create({
    data: {
      userId,
      hotelId,
      roomType,
      checkInDate,
      checkOutDate,
      totalPrice,
      // 狀態預設為 PENDING/CONFIRMED
    },
  });

  // 返回訂單摘要
  res.status(201).json({
    success: true,
    message: "Booking created. Please proceed to payment.",
    booking: newBooking,
  });
}
