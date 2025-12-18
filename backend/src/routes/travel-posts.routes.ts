import express from "express";
import { prisma } from "../utils/prisma-only.js";

const router = express.Router();

// 🟦 GET /api/travel-posts
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.travelPost.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          include: {
            avatar: true
          },
        },
        media: true,
        postTags: {
          include: {
            tag: true
          },
        },
      },
    });

    return res.json(posts);
  } catch (error) {
    console.error("❌ get posts error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
