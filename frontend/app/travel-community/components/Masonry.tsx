// app/travel-community/components/Masonry.tsx
"use client";

import PostCard from "./PostCard";
import { Post } from "../data/posts";

interface MasonryProps {
  posts: Post[];
  className?: string;
}

// 🔹 改用 grid，確保卡片先橫向排列再換行
export default function Masonry({ posts, className = "" }: MasonryProps) {
  const baseClassName = `
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    2xl:grid-cols-4
    gap-5
  `;

  return (
    <div className={`${baseClassName} ${className}`.trim()}>
      {posts.map((p) => (
        <div key={p.id} className="h-full">
          <PostCard post={p} />
        </div>
      ))}
    </div>
  );
}
