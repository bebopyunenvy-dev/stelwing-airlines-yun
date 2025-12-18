// backend/src/routes/travel-community/index.ts
import express from "express";
import type { Request } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../utils/prisma-only.js";
import { console } from "inspector";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const FRONT_TO_DB_TYPE: Record<string, "travel" | "video" | "snapshot"> = {
  遊記: "travel",
  影片: "video",
  隨手拍: "snapshot",
  travelogue: "travel",
  video: "video",
  photo: "snapshot",
  travel: "travel",
  snapshot: "snapshot",
};

const DB_TYPE_TO_FRONT: Record<"travel" | "video" | "snapshot", "遊記" | "影片" | "隨手拍"> = {
  travel: "遊記",
  video: "影片",
  snapshot: "隨手拍",
};

function getMemberIdFromToken(req: Request) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") return null;
    // @ts-ignore
    return decoded.memberId ? BigInt(decoded.memberId) : null;
  } catch {
    return null;
  }
}

function parseBigInt(value?: string | null) {
  if (!value) return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

function mapPostToCard(post: any) {
  const firstMedia = post.media?.[0];

  const displayName =
    post.author?.username?.trim() ||
    `${post.author?.firstName ?? ""}${post.author?.lastName ?? ""}`.trim() ||
    "匿名旅人";

  const content: string = post.content ?? "";

  return {
    id: Number(post.postId),
    title: post.title,
    summary:
      content.length > 110 ? content.slice(0, 110) + "..." : content,
    author: displayName,
    nickname: post.author?.username || null,
    authorAvatar: post.author?.avatar?.imagePath
      ? `/avatars/${post.author.avatar.imagePath.split("/").pop()}`
      : "/avatars/default.png",
    miles: post.author?.mileage ?? 0,
    type: DB_TYPE_TO_FRONT[post.postType as keyof typeof DB_TYPE_TO_FRONT] ?? "遊記",
    cover: firstMedia?.mediaUrl ?? "/travel-community/placeholder.png",
    duration:
      firstMedia?.mediaType === "video" && firstMedia?.durationSeconds != null
        ? `${Math.floor(firstMedia.durationSeconds / 60)}:${String(
            firstMedia.durationSeconds % 60
          ).padStart(2, "0")}`
        : undefined,
    location: post.location ?? "未知地點",
    country: post.location
      ? post.location.slice(0, 2).toUpperCase()
      : "",
    tags:
      post.postTags?.map((pt: any) => pt.tag?.name).filter(Boolean) ?? [],
    categories: [],
    createdAt:
      post.createdAt instanceof Date
        ? post.createdAt.toISOString()
        : new Date(post.createdAt).toISOString(),
    likes: post._count?.likes ?? 0,
    comments: post._count?.comments ?? 0,
    shares: post.shareCount ?? 0,
    mediaType: firstMedia?.mediaType ?? "image",
  };
}

router.get("/", async (req, res) => {
  const limitParam = Number(req.query.limit);
  const limit =
    Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(Math.floor(limitParam), 200)
      : null;
  const excludeId = parseBigInt(req.query.exclude as string | undefined);
  const requestedType = req.query.type ? FRONT_TO_DB_TYPE[String(req.query.type)] : null;

  try {
    const posts = await prisma.travelPost.findMany({
      where: {
        ...(excludeId ? { postId: { not: excludeId } } : {}),
        ...(requestedType ? { postType: requestedType } : {}),
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: limit } : {}),
      include: {
        author: {
          select: {
            memberId: true,
            username: true,
            firstName: true,
            lastName: true,
            mileage: true,
            avatar: { select: { imagePath: true } },
          },
        },
        media: { orderBy: { orderIndex: "asc" } },
        postTags: { include: { tag: true } },
        _count: { select: { comments: true, likes: true, collections: true } },
      },
    });

    res.json({
      success: true,
      data: posts.map(mapPostToCard),
    });
  } catch (error) {
    console.error("GET /travel-community error", error);
    res.status(500).json({ success: false, message: "無法取得旅遊分享列表" });
  }
});

router.get("/tags/top", async (_req, res) => {
  try {
    const tags = await prisma.postTag.groupBy({
      by: ["tagId"],
      _count: { tagId: true },
      orderBy: { _count: { tagId: "desc" } },
      take: 10,
    });

    const tagDetails = await prisma.tag.findMany({
      where: { tagId: { in: tags.map((t) => t.tagId) } },
    });

    const tagMap = new Map(tagDetails.map((t) => [t.tagId, t.name]));

    res.json({
      success: true,
      data: tags
        .map((t) => ({
          name: tagMap.get(t.tagId) ?? "",
          count: t._count.tagId,
        }))
        .filter((t) => t.name),
    });
  } catch (error) {
    console.error("GET /travel-community/tags/top error", error);
    res.status(500).json({ success: false, message: "無法取得熱門標籤" });
  }
});

router.get("/:postId", async (req, res) => {
  const postId = parseBigInt(req.params.postId);
  if (!postId) {
    return res.status(400).json({ success: false, message: "無效的文章編號" });
  }
  try {
    const post = await prisma.travelPost.findUnique({
      where: { postId, deletedAt: null },
      include: {
        author: {
          select: {
            memberId: true,
            username: true,
            firstName: true,
            lastName: true,
            mileage: true,
            avatar: { select: { imagePath: true } },
          },
        },
        media: { orderBy: { orderIndex: "asc" } },
        postTags: { include: { tag: true } },
        _count: { select: { comments: true, likes: true, collections: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "找不到這篇分享" });
    }

    const card = mapPostToCard(post);
    res.json({
      success: true,
      data: {
        ...card,
        content: post.content,
        galleryImages: post.media.map((item: any) => item.mediaUrl),
      },
    });
  } catch (error) {
    console.error("GET /travel-community/:postId error", error);
    res.status(500).json({ success: false, message: "無法取得分享內容" });
  }
});

router.post("/", async (req, res) => {
  // console.log('有觸發')
  const memberIdFromToken = getMemberIdFromToken(req);
  const {
    title,
    content,
    tags = [],
    postType = "travelogue",
    location,
    media = [],
    videoUrl,
  } = req.body;

  const resolvedAuthorId = memberIdFromToken ?? (req.body.authorId ? BigInt(req.body.authorId) : null);

  if (!resolvedAuthorId) {
    return res.status(401).json({ success: false, message: "需要登入才能發佈分享" });
  }

  if (!title || !content) {
    return res.status(400).json({ success: false, message: "請填寫標題與內容" });
  }

  const normalizedType = FRONT_TO_DB_TYPE[postType] ?? "travel";

  const mediaPayload =
    normalizedType === "video" && videoUrl
      ? [
          {
            mediaType: "video",
            mediaUrl: videoUrl,
            orderIndex: 0,
          },
        ]
      : media.map((item: any, idx: number) => ({
          mediaType: "image" as const,
          mediaUrl: item.mediaUrl,
          mimeType: item.mimeType,
          fileSizeMb: item.fileSizeMb ?? 0,
          orderIndex: item.orderIndex ?? idx,
        }));

  if (!mediaPayload.length) {
    return res.status(400).json({ success: false, message: "請至少提供一張圖片或影片" });
  }

  try {
    const created = await prisma.travelPost.create({
      data: {
        authorId: resolvedAuthorId,
        title,
        content,
        location,
        postType: normalizedType,
        totalSizeMb: mediaPayload.reduce(
          (sum: number, item: any) => sum + (item.fileSizeMb ?? 0),
          0
        ),
        media: {
          create: mediaPayload,
        },
        postTags: {
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
      include: {
        author: {
          select: {
            memberId: true,
            firstName: true,
            lastName: true,
            mileage: true,
            avatar: { select: { imagePath: true } },
          },
        },
        media: { orderBy: { orderIndex: "asc" } },
        postTags: { include: { tag: true } },
        _count: { select: { comments: true, likes: true, collections: true } },
      },
    });

         res.status(201).json({
      success: true,
      data: mapPostToCard(created),
    });
  } catch (error) {
    console.error("🔥 POST /travel-community 真實錯誤：", error);

    return res.status(500).json({
      success: false,
      message: "無法建立分享",
      error: (error as any).message,
    });
  }
});   // ★★★★ ← 你少了這個！！

export default router;
