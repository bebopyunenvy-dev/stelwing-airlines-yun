import { Router } from "express";
import { prisma } from "../../utils/prisma-only.js";
import moment from "moment-timezone";
import { success, z } from "zod";
import jwt from "jsonwebtoken";
import { CreateBookingSchema } from "./schemas";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function getMemberIdFromToken(req: any): number | null {
  const auth = req.headers?.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { memberId: number };
    return decoded.memberId;
  } catch {
    return null;
  }
}

/* ===================== 小工具 ===================== */
function safeTz(tz: string, fallback: string) {
  return moment.tz.zone(tz) ? tz : fallback;
}
const CurrencyQuery = z.object({
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .length(3)
    .optional()
    .default("TWD"),
});

/* 新增：座位查詢參數 */
const SeatQuery = z.object({
  flightId: z
    .string()
    .regex(/^\d+$/, "flightId must be a positive integer string"),
  onlyAvailable: z
    .union([z.string(), z.number(), z.boolean()])
    .optional()
    .transform((v) => (v === "1" || v === 1 || v === true)),
});

router.get("/list", async (req, res) => {
  const originZone = safeTz(String(req.query.originZone ?? "Asia/Taipei"), "Asia/Taipei");
  const destZone = safeTz(String(req.query.destZone ?? "Asia/Tokyo"), "Asia/Tokyo");

  try {
    const rows = await prisma.flight.findMany({
      orderBy: [{ flightDate: "asc" }, { flightNumber: "asc" }],
    });

    const data = rows.map((f) => ({
      // 如需避免 BigInt JSON 問題，這裡可轉字串
      flightId: String(f.flightId),
      flightNumber: f.flightNumber,
      flightDate: f.flightDate, // 出發地「日期」
      originIata: f.originIata,
      destinationIata: f.destinationIata,
      status: f.status,

      // DB 內原始 UTC（除錯用）
      depUtcISO: f.depTimeUtc ? moment(f.depTimeUtc).utc().toISOString() : null,
      arrUtcISO: f.arrTimeUtc ? moment(f.arrTimeUtc).utc().toISOString() : null,

      // 轉回當地時區（顯示用）
      depLocalDisplay: f.depTimeUtc
        ? moment(f.depTimeUtc).tz(originZone).format("YYYY-MM-DD HH:mm")
        : null,
      arrLocalDisplay: f.arrTimeUtc
        ? moment(f.arrTimeUtc).tz(destZone).format("YYYY-MM-DD HH:mm")
        : null,
    }));

    res.json({ originZone, destZone, count: data.length, data });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "讀取航班清單失敗",
      error: err?.message ?? String(err),
    });
  }
});

/** 行李加購：GET /baggage-options?currency=TWD */
router.get("/baggage-options", async (req, res) => {
  const parsed = CurrencyQuery.safeParse({
    currency: typeof req.query.currency === "string" ? req.query.currency : undefined,
  });
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { currency } = parsed.data;

  try {
    const rows = await prisma.baggageOption.findMany({
      where: { currency },
      orderBy: [{ weightKg: "asc" }, { fee: "asc" }],
    });

    const data = rows.map((o) => ({
      baggageId: String(o.baggageId),
      weightKg: o.weightKg,
      fee: o.fee,
      currency: o.currency,
    }));

    res.json({ currency, count: data.length, data });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "取得行李加購失敗",
      error: err?.message ?? String(err),
    });
  }
});

/** 餐食加購：GET /meal-options?currency=TWD */
router.get("/meal-options", async (req, res) => {
  const parsed = CurrencyQuery.safeParse({
    currency: typeof req.query.currency === "string" ? req.query.currency : undefined,
  });
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { currency } = parsed.data;

  try {
    const rows = await prisma.mealOption.findMany({
      where: { currency },
      orderBy: [{ mealFee: "asc" }, { mealName: "asc" }],
    });

    const data = rows.map((o) => ({
      mealId: String(o.mealId),
      mealCode: o.mealCode,
      mealName: o.mealName,
      mealType: o.mealType ?? null,
      mealFee: o.mealFee,
      currency: o.currency,
      mealImagePath: o.mealImagePath ?? null,
    }));

    res.json({ currency, count: data.length, data });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "取得餐食加購失敗",
      error: err?.message ?? String(err),
    });
  }
});

/** 座位查詢：GET /seat-options?flightId=123&onlyAvailable=1 */
router.get("/seat-options", async (req, res) => {
  const parsed = SeatQuery.safeParse({
    flightId: typeof req.query.flightId === "string" ? req.query.flightId : undefined,
    onlyAvailable: req.query.onlyAvailable as any,
  });
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { flightId, onlyAvailable } = parsed.data;
  const fid = BigInt(flightId);

  try {
    // 可選：確認航班存在
    const exists = await prisma.flight.findUnique({ where: { flightId: fid } });
    if (!exists) return res.status(404).json({ message: "flight not found" });

    const seats = await prisma.seatOption.findMany({
      where: {
        flightId: fid,
        ...(onlyAvailable ? { isAvailable: true } : {}),
      },
      // 注意：seatNumber 為字串，單純字典排序會讓 '10A' 排在 '2A' 前
      // 若需要更精準的排序建議前端再排序或在 DB 使用更複雜的排序式。
      orderBy: [{ seatNumber: "asc" }],
    });

    const data = seats.map((s) => ({
      seatId: String(s.seatId),
      flightId: String(s.flightId),
      seatNumber: s.seatNumber,
      cabinClass: s.cabinClass,
      isAvailable: s.isAvailable,
      seatFee: s.seatFee,
    }));

    res.json({ flightId: String(fid), count: data.length, data });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "取得座位失敗",
      error: err?.message ?? String(err),
    });
  }
});

function genPNR(len = 6) {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += A[Math.floor(Math.random() * A.length)];
  }
  return out;
}

// 建立訂單：POST /bookings
router.post("/bookings", async (req, res) => {
  const memberId = getMemberIdFromToken(req);

  if (!memberId) {
    return res.status(401).json({
      success: false,
      message: "未登入，請先登入會員再建立訂單",
    });
  }

  // 1) 後端欄位驗證（包含護照規則）
  const parsed = CreateBookingSchema.safeParse(req.body);

  if (!parsed.success) {
    const flat = parsed.error.flatten();

    return res.status(400).json({
      success: false,
      message: "訂單資料驗證失敗",
      errors: flat.fieldErrors, // 例如 { firstName: [...], passportNo: [...] }
    });
  }

  // 2) 驗證通過，才取出整理好的資料
  const data: CreateBookingInput = parsed.data;
  const pnr = genPNR();

  try {
    const result = await prisma.$transaction(async (tx) => {
      /* 1 建 booking（只要 CreateBookingSchema 有過，這邊就是乾淨的） */
      const booking = await tx.booking.create({
        data: {
          pnr,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender ?? null,
          nationality: data.nationality ?? null,
          passportNo: data.passportNo ?? null,
          cabinClass: data.cabinClass,
          currency: data.currency,
          totalAmount: data.totalAmount,
          paymentStatus: "pending",
          paymentMethod: "ecpay",
          memberId: BigInt(memberId),
        },
      });

      const bookingId = booking.bookingId;

      /* 2 建 BookingDetail：去程 */
      for (const seat of data.outbound.seats) {
        await tx.bookingDetail.create({
          data: {
            bookingId,
            flightId: data.outbound.flightId,
            tripType: "OB",
            seatId: seat.seatId,
            baggageId: data.outbound.baggageId ?? null,
            mealId: data.outbound.mealId ?? null,
          },
        });

        // 鎖定座位
        await tx.seatOption.update({
          where: { seatId: seat.seatId },
          data: { isAvailable: false },
        });
      }

      /* 3 回程（如果有） */
      if (data.inbound) {
        for (const seat of data.inbound.seats) {
          await tx.bookingDetail.create({
            data: {
              bookingId,
              flightId: data.inbound.flightId,
              tripType: "IB",
              seatId: seat.seatId,
              baggageId: data.inbound.baggageId ?? null,
              mealId: data.inbound.mealId ?? null,
            },
          });

          await tx.seatOption.update({
            where: { seatId: seat.seatId },
            data: { isAvailable: false },
          });
        }
      }

      return { booking, pnr };
    });

    return res.json({
      success: true,
      pnr,
      bookingId: String(result.booking.bookingId),
      totalAmount: result.booking.totalAmount,
    });
  } catch (err) {
    console.error("建立訂單失敗：", err);
    return res.status(500).json({
      success: false,
      message: "建立訂單失敗",
      error: err ?? String(err),
    });
  }
});

// 查詢訂單明細 GET /bookings/:pnr
router.get("/bookings/:pnr", async (req, res) => {
  const { pnr } = req.params;

  // 1) 一樣從 token 取出 memberId
  const memberId = getMemberIdFromToken(req);
  if (!memberId) {
    return res.status(401).json({
      success: false,
      message: "未登入，無法查看訂單",
    });
  }

  try {
    // 2) 只查「這個會員」的這張訂單
    const booking = await prisma.booking.findFirst({
      where: {
        pnr,
        memberId: BigInt(memberId),
      },
      include: {
        details: {
          include: {
            flight: true,
            seat: true,     
            baggage: true,  
            meal: true,     
          },
          orderBy: {
            tripType: "asc",
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "找不到訂單",
      });
    }

    // 3) 整理成前端 page.tsx 期望的結構 (Booking / BookingDetail)
    const data = {
      bookingId: Number(booking.bookingId),
      pnr: booking.pnr,
      currency: booking.currency ?? "TWD",
      totalAmount: Number(booking.totalAmount ?? 0),
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      createdAt:
        booking.createdAt instanceof Date
          ? booking.createdAt.toISOString()
          : String(booking.createdAt),
      details: booking.details.map((d) => ({
        // 這裡欄位名稱請依照你的 Prisma 實際欄位調整
        detailId: Number(d.bookingDetailId ?? d.detailId ?? 0),
        tripType: d.tripType as "OB" | "IB",

        seat: d.seat
          ? {
              seatNumber: d.seat.seatNumber,
            }
          : null,

        baggage: d.baggage
          ? {
              weightKg: Number(d.baggage.weightKg ?? 0),
              price: Number(d.baggage.price ?? 0),
            }
          : null,

        meal: d.meal
          ? {
              mealName: d.meal.mealName,
              price: Number(d.meal.price ?? 0),
            }
          : null,

        flight: {
          flightNumber: d.flight.flightNumber,
          flightDate: d.flight.flightDate, // 'YYYY-MM-DD'
          originIata: d.flight.originIata,
          destinationIata: d.flight.destinationIata,
          depTimeUtc: d.flight.depTimeUtc, // ISO 字串
          arrTimeUtc: d.flight.arrTimeUtc,
        },
      })),
    };

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("查詢訂單失敗：", err);
    return res.status(500).json({
      success: false,
      message: "查詢訂單失敗",
    });
  }
});



// 查詢訂單列表 GET /bookings
router.get("/bookings", async (req, res) => {
  try {
    // 1) 先從 token 拿 memberId
    const memberId = getMemberIdFromToken(req);
    if (!memberId) {
      return res.status(401).json({
        success: false,
        message: "未登入，無法查看訂單列表",
      });
    }

    const tz = safeTz(String(req.query.tz ?? "Asia/Taipei"), "Asia/Taipei");

    // 2) 用 $queryRaw（安全綁參數）＋ 加上 WHERE b.member_id = ${...}
    const rows = await prisma.$queryRaw<any[]>`
      SELECT
        b.booking_id       AS bookingId,
        b.pnr              AS pnr,
        b.payment_method   AS paymentMethod,
        b.payment_status   AS paymentStatus,
        CAST(b.created_at AS CHAR) AS createdAtUtc,

        -- 去程航段
        MIN(
          CASE 
            WHEN bd.trip_type IN ('OB', 'outbound') THEN f.origin_iata 
          END
        ) AS originIata,
        MIN(
          CASE 
            WHEN bd.trip_type IN ('OB', 'outbound') THEN f.destination_iata 
          END
        ) AS destinationIata,

        -- 去程日期
        MIN(
          CASE 
            WHEN bd.trip_type IN ('OB', 'outbound') THEN f.flight_date 
          END
        ) AS outboundDate,

        -- 回程日期（若為單程則會是 NULL）
        MIN(
          CASE 
            WHEN bd.trip_type IN ('IB', 'inbound') THEN f.flight_date 
          END
        ) AS inboundDate

      FROM bookings b
      LEFT JOIN booking_details bd ON bd.booking_id = b.booking_id
      LEFT JOIN flights f ON f.flight_id = bd.flight_id
      WHERE b.member_id = ${BigInt(memberId)}   -- ⭐ 只撈這個會員的訂單
      GROUP BY b.booking_id
      ORDER BY b.booking_id DESC;
    `;

    // 3) 把時間轉換成前端要的 createdAt
    const data = rows.map((row) => {
      const createdAtLocal = row.createdAtUtc
        ? moment.tz(row.createdAtUtc, "UTC").tz(tz).format("YYYY-MM-DD HH:mm:ss")
        : null;

      return {
        ...row,
        createdAt: createdAtLocal,
      };
    });

    return res.json({
      success: true,
      data,
    });
  } catch (e) {
    console.error("查詢訂單列表失敗（raw）：", e);
    return res.status(500).json({
      success: false,
      message: "查詢訂單列表失敗",
      error: String(e),
    });
  }
});

// 改票 PATCH /bookings/:pnr/change
router.patch("/bookings/:pnr/change", async (req, res) => {
    try {
    const memberId = getMemberIdFromToken(req);
    if (!memberId) {
      return res.status(401).json({
        success: false,
        message: "未登入，無法改票",
      });
    }

    const { pnr } = req.params;

    // 前端傳的資料
    const { outboundFlightId, inboundFlightId } = req.body;

    // 查詢是否存在
    const booking = await prisma.booking.findUnique({
      where: { pnr, memberId: BigInt(memberId), },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "查無此訂單（PNR）",
      });
    }

    // 更新去程/回程
    const updates: any[] = [];

    if (outboundFlightId) {
      updates.push(
        prisma.bookingDetail.updateMany({
          where: {
            bookingId: booking.bookingId,
            tripType: { in: ["OB", "outbound"] },
          },
          data: { flightId: outboundFlightId },
        })
      );
    }

    if (inboundFlightId) {
      updates.push(
        prisma.bookingDetail.updateMany({
          where: {
            bookingId: booking.bookingId,
            tripType: { in: ["IB", "inbound"] },
          },
          data: { flightId: inboundFlightId },
        })
      );
    }

    await prisma.$transaction(updates);

    return res.json({
      success: true,
      message: "改票成功",
    });
  } catch (err) {
    console.error("改票錯誤：", err);
    res.status(500).json({
      success: false,
      message: "改票失敗",
      error: String(err),
    });
  }
});

//退票 POST /bookings/:pnr/refund
router.post('/bookings/:pnr/refund', async (req, res) => {
    const memberId = getMemberIdFromToken(req);
  if (!memberId) {
    return res.status(401).json({
      success: false,
      message: "未登入，無法退票",
    });
  }

  const pnr = req.params.pnr;
  const tripType = req.body?.tripType as 'OB' | 'IB' | undefined; // 可選：去程 / 回程

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        pnr,
        memberId: BigInt(memberId),
      },
      include: {
        details: true,
      },
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "找不到訂單或無權限" });
    }

    // 如果已經是 refunded，就直接回傳
    if (booking.paymentStatus === 'refunded') {
      return res.json({
        success: true,
        message: '此訂單已退款',
        data: booking,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 要處理的明細：如果有帶 tripType，就只處理去程或回程；沒帶就整筆都退
      const targetDetails = booking.details.filter((d) =>
        tripType ? d.tripType === tripType : true
      );

      // 1) 釋放座位
      for (const d of targetDetails) {
        if (d.seatId) {
          await tx.seatOption.update({
            where: { seatId: d.seatId },
            data: { isAvailable: true },
          });
        }
      }

      // 2) 簡化處理：整筆訂單標記為 refunded
      //   之後如果要做到「部分退票」，可以在 booking_details 上增加 status 欄位再優化
      const updatedBooking = await tx.booking.update({
        where: { bookingId: booking.bookingId },
        data: {
          paymentStatus: 'refunded',
        },
        include: {
          details: true,
        },
      });

      return updatedBooking;
    });

    return res.json({
      success: true,
      message: '退票成功（目前直接標記為 refunded）',
      data: result,
    });
  } catch (e) {
    console.error('退票失敗：', e);
    return res.status(500).json({
      success: false,
      message: '退票失敗',
      error: String(e),
    });
  }
});


/* ===================== 動態路由（放最後） ===================== */
/** 明細：GET /:id?originZone=...&destZone=... */
router.get("/:id", async (req, res) => {
  // BigInt 轉型＋防呆
  let flightId: bigint;
  try {
    flightId = BigInt(req.params.id);
  } catch {
    return res.status(400).json({ error: "Invalid flight id" });
  }

  const originZone = safeTz(String(req.query.originZone ?? "Asia/Taipei"), "Asia/Taipei");
  const destZone = safeTz(String(req.query.destZone ?? "Asia/Tokyo"), "Asia/Tokyo");

  try {
    const f = await prisma.flight.findUnique({ where: { flightId } });
    if (!f) return res.status(404).json({ error: "Flight not found" });

    res.json({
      ...f,
      flightId: String(f.flightId), // 避免 BigInt JSON 問題
      depUtcISO: f.depTimeUtc ? moment(f.depTimeUtc).utc().toISOString() : null,
      arrUtcISO: f.arrTimeUtc ? moment(f.arrTimeUtc).utc().toISOString() : null,
      depLocalDisplay: f.depTimeUtc
        ? moment(f.depTimeUtc).tz(originZone).format("YYYY-MM-DD HH:mm")
        : null,
      arrLocalDisplay: f.arrTimeUtc
        ? moment(f.arrTimeUtc).tz(destZone).format("YYYY-MM-DD HH:mm")
        : null,
      zones: { originZone, destZone },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "讀取航班明細失敗",
      error: err?.message ?? String(err),
    });
  }
});

export default router;
