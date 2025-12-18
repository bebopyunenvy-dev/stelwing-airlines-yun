
import { Router, type Request, type Response } from "express";
import { PrismaClient } from "../../generated/prisma/index.js";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

// 將參數統一大寫、並驗證
const SearchSchema = z.object({
  origin: z.string().length(3).transform(s => s.toUpperCase()),
  destination: z.string().length(3).transform(s => s.toUpperCase()),
  // YYYY-MM-DD
  depart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).refine(v => v.origin !== v.destination, { message: "origin/destination 不可相同" });

/**
 * 關鍵：用「日期區間」比對，不用等於（避免時區/毫秒差異）
 *    若你的 schema 是：
 *      - flightDate: Date (MySQL DATE)   → 以日期區間 gte/lt 過濾
 *      - depTimeUtc/arrTimeUtc: DateTime → 排序與計算時長
 */
router.get("/search", async (req: Request, res: Response) => {
  try {
    const parsed = SearchSchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    const { origin, destination, depart } = parsed.data;

    // 以「當天 00:00 ~ 次日 00:00」做區間（UTC）
    // 如果 flightDate 是 MySQL DATE，Prisma 會當成 00:00:00.000，
    // 用 gte/lt 最穩，能涵蓋不同序列化的 Date。
    const start = new Date(`${depart}T00:00:00.000Z`);
    const end = new Date(`${depart}T00:00:00.000Z`);
    end.setUTCDate(end.getUTCDate() + 1);

    const flights = await prisma.flight.findMany({
      where: {
        originIata: origin,
        destinationIata: destination,
        // 用區間，不用等於
        flightDate: { gte: start, lt: end },
      },
      orderBy: [{ depTimeUtc: "asc" }],
      take: 50,
    });

    const dto = flights.map((f) => {
      const dep = f.depTimeUtc ? new Date(f.depTimeUtc as any) : null;
      const arr = f.arrTimeUtc ? new Date(f.arrTimeUtc as any) : null;
      const durationMinutes =
        dep && arr ? Math.max(0, Math.round((arr.getTime() - dep.getTime()) / 60000)) : null;

      return {
        flightId: Number((f as any).flightId ?? (f as any).id ?? 0) || `${f.flightNumber}-${f.flightDate}`,
        flightNo: f.flightNumber,
        carrier: "Stelwing Airlines", // 目前無 carrier 欄位，先給固定字串
        origin: f.originIata,
        destination: f.destinationIata,
        departTime: f.depTimeUtc,
        arriveTime: f.arrTimeUtc,
        durationMinutes,
        currency: "TWD",
        status: f.status,
      };
    });

    res.json({ outbounds: dto });
  } catch (err) {
    console.error("[flights/search] error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;