// ===========================================================
//  若晴修正版（正確版）2025/11/17
//  ✔️ avatar 關聯名稱修正（最重要的錯誤）
//  ✔️ 移除重複 API
//  ✔️ register 預設頭像
//  ✔️ verify 回傳完整會員資料
//  ✔️ update-password 加回來
//  ✔️ 完整註解保留
// ===========================================================

import express, { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma-only.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

/* ===========================================================
   1️⃣ 註冊
   =========================================================== */
router.post("/register", async (req: Request, res: Response) => {
  const { firstName, lastName, birthDate, gender, email, password } = req.body;

  if (!firstName || !lastName || !birthDate || !gender || !email || !password) {
    return res.status(400).json({ message: "缺少必要欄位" });
  }

  if (!["M", "F"].includes(gender)) {
    return res.status(400).json({ message: "性別格式不正確" });
  }

  try {
    const existing = await prisma.member.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "此信箱已註冊" });

    const hashed = await bcrypt.hash(password, 10);

    // ⭐ 依資料庫中的實際預設頭像取得 avatarId，若沒找到就拿第一個可用頭像
    //    若整個 avatar_options 是空的，就立即補上一筆預設圖，避免外鍵錯誤
    const defaultAvatar =
      (await prisma.avatarOption.findFirst({
        where: {
          OR: [
            { imagePath: { contains: "default" } },
            { label: { contains: "預設" } },
          ],
        },
        orderBy: { avatarId: "asc" },
      })) ??
      (await prisma.avatarOption.findFirst({
        where: { isActive: true },
        orderBy: { avatarId: "asc" },
      })) ??
      (await prisma.avatarOption.create({
        data: {
          imagePath: "/avatars/default.png",
          label: "預設頭像",
          isActive: true,
        },
      }));

    const newUser = await prisma.member.create({
      data: {
        firstName,
        lastName,
        birthDate: new Date(birthDate),
        gender,
        email,
        password: hashed,

        // ⭐ 註冊給預設頭像，如果沒有資料則留空
        avatarChoice: defaultAvatar?.avatarId,
      },
    });

    res.status(201).json({
      message: "註冊成功",
      memberId: newUser.memberId.toString(),
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

/* ===========================================================
   2️⃣ 登入
   =========================================================== */
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.member.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "帳號不存在" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "密碼錯誤" });

    // ⭐ 更新最後登入
    await prisma.member.update({
      where: { memberId: user.memberId },
      data: { lastLogin: new Date() },
    });

    const token = jwt.sign(
      { memberId: Number(user.memberId), email: user.email },
      JWT_SECRET,
      { expiresIn: "3h" } 
    );

    res.json({ message: "登入成功", token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

/* ===========================================================
   3️⃣ 驗證 Token（含完整會員資料）
   =========================================================== */
router.get("/verify", async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ ok: false, message: "未提供 token" });

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { memberId: number };

    const member = await prisma.member.findUnique({
      where: { memberId: BigInt(decoded.memberId) },
      select: {
        memberId: true,
        email: true,
         username: true,
        firstName: true,
        lastName: true,
        gender: true,
        birthDate: true,
        phoneNumber: true,
        country: true,
        city: true,
        address: true,
        postalCode: true,
        createdAt: true,
        lastLogin: true,
        membershipLevel: true,
        mileage: true,
        avatarChoice: true,

        // ⭐ 正確欄位：avatar（不是 avatarOption）
        avatar: {
          select: {
            avatarId: true,
            imagePath: true,
            label: true,
          },
        },
      },
    });

    if (!member) return res.status(404).json({ ok: false, message: "找不到會員" });

    res.json({ ok: true, member });
  } catch (err) {
    console.error("❌ Verify error:", err);
    res.status(401).json({ ok: false, message: "token 無效或過期" });
  }
});

/* ===========================================================
   4️⃣ 取得頭像圖庫
   =========================================================== */
router.get("/avatars", async (_req, res) => {
  try {
    const avatars = await prisma.avatarOption.findMany({
      where: { isActive: true },
      select: {
        avatarId: true,
        imagePath: true,
        label: true,
      },
    });

    res.json({ ok: true, avatars });
  } catch (err) {
    console.error("❌ Fetch avatars error:", err);
    res.status(500).json({ ok: false, message: "伺服器錯誤" });
  }
});

/* ===========================================================
   5️⃣ 更新會員頭像
   =========================================================== */
router.put("/update-avatar", async (req: Request, res: Response) => {
  const { memberId, avatarChoice } = req.body;

  if (!memberId || !avatarChoice) {
    return res.status(400).json({
      ok: false,
      message: "缺少必要參數（memberId 或 avatarChoice）",
    });
  }

  try {
    const updated = await prisma.member.update({
      where: { memberId: BigInt(memberId) },
      data: { avatarChoice: Number(avatarChoice) },
      include: { avatar: true }, // ⭐ 正確關聯
    });

    res.json({
      ok: true,
      message: "頭像更新成功",
      member: {
        memberId: updated.memberId,
        avatarChoice: updated.avatarChoice,
        avatar: updated.avatar,
      },
    });
  } catch (err) {
    console.error("❌ Update avatar error:", err);
    res.status(500).json({ ok: false, message: "伺服器錯誤" });
  }
});

/* ===========================================================
   6️⃣ 更新會員資料
   =========================================================== */
router.put("/update-profile", async (req: Request, res: Response) => {
  const {
    memberId,
    username,
    firstName,
    lastName,
    gender,
    birthDate,
    phoneNumber,
    address,
    city,
    country,
    postalCode,
    passportNumber,
    passportExpiry,
  } = req.body;

  if (!memberId)
    return res.status(400).json({ ok: false, message: "缺少 memberId" });

  try {
    const updated = await prisma.member.update({
      where: { memberId: BigInt(memberId) },
      data: {
        username: username ?? undefined,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        gender: gender || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        phoneNumber: phoneNumber || null,
        address: address || null,
        city: city || null,
        country: country || null,
        postalCode: postalCode || null,
        passportNumber: passportNumber || null,
        passportExpiry: passportExpiry ? new Date(passportExpiry) : null,
      },
    });

    res.json({ ok: true, message: "會員資料已更新", member: updated });
  } catch (err) {
    console.error("❌ Update profile error:", err);
    res.status(500).json({ ok: false, message: "伺服器錯誤" });
  }
});

/* ===========================================================
   7️⃣ 變更密碼
   =========================================================== */
router.put("/update-password", async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ ok: false, message: "未提供 token" });

  const token = auth.split(" ")[1];
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return res.status(400).json({ ok: false, message: "缺少欄位" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { memberId: number };

    const member = await prisma.member.findUnique({
      where: { memberId: BigInt(decoded.memberId) },
    });

    if (!member) return res.status(404).json({ ok: false, message: "找不到會員" });

    const match = await bcrypt.compare(oldPassword, member.password);
    if (!match) return res.status(401).json({ ok: false, message: "舊密碼錯誤" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.member.update({
      where: { memberId: BigInt(decoded.memberId) },
      data: { password: hashed },
    });

    res.json({ ok: true, message: "密碼更新成功" });
  } catch (err) {
    console.error("❌ Update password error:", err);
    res.status(500).json({ ok: false, message: "伺服器錯誤" });
  }
});

/* =========================================================== */
export default router;
