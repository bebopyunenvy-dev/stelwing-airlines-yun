// src/routes/member.routes.ts
import express from "express";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma-only.js";
import bcrypt from "bcrypt"; // ⚙️ 確保有引入 bcrypt

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// ✅ 解析 JWT token，取得 memberId
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

// ✅ 1️⃣ 取得會員資料
router.get("/profile", async (req, res) => {
  const memberId = getMemberIdFromToken(req);
  if (!memberId) return res.status(401).json({ ok: false, message: "未登入" });

  try {
    const member = await prisma.member.findUnique({
      where: { memberId: BigInt(memberId) },
      select: {
        memberId: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        address: true,
        gender: true,
        birthDate: true,
        membershipLevel: true,
      },
    });

    if (!member) return res.status(404).json({ ok: false, message: "找不到會員" });

    res.json({ ok: true, member });
  } catch (err) {
    console.error("❌ Get member error:", err);
    res.status(500).json({ ok: false, message: "伺服器錯誤" });
  }
});

// ✅ 2️⃣ 更新會員資料
router.put("/profile", async (req, res) => {
  const memberId = getMemberIdFromToken(req);
  if (!memberId) return res.status(401).json({ ok: false, message: "未登入" });

  try {
    const { firstName, lastName, phoneNumber, address, gender, birthDate } = req.body;

    const updated = await prisma.member.update({
      where: { memberId: BigInt(memberId) },
      data: {
        firstName,
        lastName,
        phoneNumber,
        address,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    });

    res.json({ ok: true, member: updated });
  } catch (err) {
    console.error("❌ Update member error:", err);
    res.status(500).json({ ok: false, message: "伺服器錯誤" });
  }
});

// ✅ 3️⃣ 變更密碼
router.put("/password", async (req, res) => {
  const memberId = getMemberIdFromToken(req);
  if (!memberId) return res.status(401).json({ ok: false, message: "未登入" });

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return res.status(400).json({ ok: false, message: "請輸入舊密碼與新密碼" });

  try {
    const member = await prisma.member.findUnique({
      where: { memberId: BigInt(memberId) },
    });
    if (!member) return res.status(404).json({ ok: false, message: "找不到會員" });

    const match = await bcrypt.compare(oldPassword, member.password);
    if (!match) return res.status(401).json({ ok: false, message: "舊密碼錯誤" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.member.update({
      where: { memberId: BigInt(memberId) },
      data: { password: hashed },
    });

    res.json({ ok: true, message: "密碼更新成功" });
  } catch (err) {
    console.error("❌ Password change error:", err);
    res.status(500).json({ ok: false, message: "伺服器錯誤" });
  }
});

export default router;
