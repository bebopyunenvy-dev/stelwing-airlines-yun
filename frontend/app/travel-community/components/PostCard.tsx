"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "../data/posts";

const getYoutubeThumbnail = (url?: string | null) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
  } catch {
    return null;
  }
  return null;
};

export default function PostCard({ post }: { post: Post }) {
  const [error, setError] = useState(false);

  const isVideo = post.type === "影片";
  const avatarSrc = post.authorAvatar || "/avatars/default.png";
  const displayName = post.nickname?.trim() || post.author;
  const locationLabel = post.location?.trim() || post.country?.trim() || "";
  const coverSrc =
    isVideo ? getYoutubeThumbnail(post.cover) ?? post.cover : post.cover;

  return (
    <Link href={`/travel-community/${post.id}`}>
      <article
        className="
          mb-[18px]
          break-inside-avoid
          rounded-[var(--sw-r-lg)]
          border border-[rgba(31,46,60,0.08)]
          bg-white shadow-sm overflow-hidden
          cursor-pointer
          hover:shadow-md hover:-translate-y-[2px]
          transition
        "
      >
        {/* 圖片區 */}
        <div className="relative w-full pb-[140%] overflow-hidden bg-[var(--sw-primary)]">
          {/* 圖片成功 */}
          {!error && coverSrc && (
            <img
              src={coverSrc}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setError(true)}
            />
          )}

          {/* fallback 無圖片 */}
          {(!post.cover || error) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-[var(--sw-primary)]">
              <div className="w-2/3 h-[2px] bg-[var(--sw-accent)] mb-3 rounded-full opacity-80" />
              <span className="text-[var(--sw-white)] font-bold text-[14px] tracking-wider uppercase">
                NO IMAGE
              </span>
              <div className="flex gap-[3px] mt-3">
                <div className="w-1 h-1 bg-[var(--sw-accent)] rounded-full"></div>
                <div className="w-1 h-1 bg-[var(--sw-accent)] rounded-full"></div>
                <div className="w-1 h-1 bg-[var(--sw-accent)] rounded-full"></div>
              </div>
            </div>
          )}

          {/* 類型標籤 → 改右上角 */}
          <div className="absolute right-2 top-2 text-right">
            <span
              className="
                rounded-full bg-white/85 backdrop-blur
                px-2 py-1 text-[11px] font-semibold
              "
            >
              {post.type}
              {isVideo && post.duration ? `・${post.duration}` : ""}
            </span>
          </div>
        </div>

        {/* 內容區 */}
        <div className="p-3 space-y-2">
          {/* 地點（固定高度 20px） */}
          {locationLabel ? (
            <div className="text-sm text-[#1F2E3C]/70 h-[20px] truncate">
              {locationLabel}
            </div>
          ) : (
            <div className="h-[20px]" />
          )}

          {/* 標題（固定高度 48px） */}
          <div className="sw-h6 leading-tight text-[#1F2E3C] font-bold h-[48px] line-clamp-2">
            {post.title}
          </div>

          {/* 摘要（固定高度 40px） */}
          <p className="text-sm text-[#1F2E3C]/70 line-clamp-2 h-[40px]">
            {post.summary}
          </p>

          {/* 標籤 */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-[11px] rounded-full border border-[rgba(31,46,60,0.08)] text-[#1F2E3C]/70"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 底部：作者 + 日期 + 哩程 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <img
                src={avatarSrc}
                alt={post.author}
                className="h-6 w-6 rounded-full object-cover"
              />
              <span>{displayName}</span>
            </div>
            <div className="text-[#DCBB87] font-semibold">
              💳 {post.miles.toLocaleString()} 哩程
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
