// app/travel-community/[postId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/app/components/Breadcrumb";
import {
  Bookmark,
  Check,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Masonry from "../components/Masonry";
import FloatingWriteButton from "../components/FloatingWriteButton";
import type { Post } from "../data/posts";
import { apiFetch } from "@/app/travel-planner/utils/apiFetch";

interface TravelPostDetail extends Post {
  content: string;
  galleryImages: string[];
}

interface Reply {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  avatar: string;
  isAuthor?: boolean;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  avatar: string;
  isAuthor?: boolean;
  replies?: Reply[];
}

const commentAvatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
];

export default function TravelDetailPage() {
  const { postId } = useParams();

  const [post, setPost] = useState<TravelPostDetail | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTarget, setReplyTarget] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyAsAuthor, setReplyAsAuthor] = useState(false);
  const seededRef = useRef(false);
  const [activeImage, setActiveImage] = useState(0);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3007";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<TravelPostDetail>(`http://localhost:3007/api/travel-community/${postId}`);
        setPost(data);
        setError(null);
      } catch (err: any) {
        setError(err.message ?? "無法載入分享內容");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchPost();
  }, [postId, API_BASE]);

  useEffect(() => {
    if (!post || seededRef.current) return;
    seededRef.current = true;
    setComments([
      {
        id: 1,
        author: post.author,
        content: "清晨的光影真讓人著迷！謝謝大家一起感受旅行氛圍。",
        createdAt: "昨天 20:15",
        avatar: commentAvatars[0],
        isAuthor: true,
        replies: [
          {
            id: 101,
            author: "一日遊小達人",
            content: "被你的文字打動了，期待下一次分享！",
            createdAt: "昨天 21:05",
            avatar: commentAvatars[2],
          },
        ],
      },
      {
        id: 2,
        author: "Charlie",
        content: "太讚了，明年也想安排行程！",
        createdAt: "昨天 22:35",
        avatar: commentAvatars[3],
      },
    ]);
  }, [post]);

  useEffect(() => {
    if (!post) return;
    const fetchRelated = async () => {
      try {
        const data = await apiFetch<Post[]>(
          `http://localhost:3007/api/travel-community?limit=6&type=${encodeURIComponent(post.type)}&exclude=${post.id}`
        );
        setRelatedPosts(data);
      } catch (err) {
        console.error("相關分享載入失敗", err);
      }
    };
    fetchRelated();
  }, [post, API_BASE]);

  useEffect(() => {
    setActiveImage(0);
  }, [post?.id]);

  if (loading) {
    return (
      <main className="space-y-6">
        <Breadcrumb
          items={[
            { label: "首頁", href: "/" },
            { label: "旅遊分享", href: "/travel-community" },
            { label: "載入中..." },
          ]}
        />
        <div className="p-10 text-center text-gray-400">載入中...</div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="space-y-6">
        <Breadcrumb
          items={[
            { label: "首頁", href: "/" },
            { label: "旅遊分享", href: "/travel-community" },
            { label: "文章不存在" },
          ]}
        />
        <div className="p-10 text-center text-gray-500">
          {error ?? "找不到這篇文章"}
        </div>
      </main>
    );
  }

  const galleryImages =
    post.galleryImages && post.galleryImages.length
      ? post.galleryImages
      : post.cover
      ? [post.cover]
      : [];
  const publishedAt = new Date(post.createdAt).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const locationLabel = post.location?.trim() || post.country?.trim() || "";

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        author: "你",
        content: newComment.trim(),
        createdAt: new Date().toLocaleTimeString("zh-TW", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "/avatars/default.png",
      },
    ]);
    setNewComment("");
  };

  const handleReplySubmit = () => {
    if (!replyTarget || !replyText.trim()) return;
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === replyTarget
          ? {
              ...comment,
              replies: [
                ...(comment.replies ?? []),
                {
                  id: Date.now(),
                  author: replyAsAuthor ? post.author : "你",
                  content: replyText.trim(),
                  createdAt: new Date().toLocaleTimeString("zh-TW", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  avatar: replyAsAuthor
                    ? commentAvatars[1]
                    : "/avatars/default.png",
                  isAuthor: replyAsAuthor,
                },
              ],
            }
          : comment
      )
    );
    setReplyTarget(null);
    setReplyText("");
    setReplyAsAuthor(false);
  };

  const goPrevImage = () => {
    if (!galleryImages.length) return;
    setActiveImage((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const goNextImage = () => {
    if (!galleryImages.length) return;
    setActiveImage((prev) => (prev + 1) % galleryImages.length);
  };

  const isAuthorName = (name: string) => (post ? name === post.author : false);

  return (
    <main className="mx-auto w-full max-w-[1312px] space-y-6 px-4 lg:px-0">
      <Breadcrumb
        items={[
          { label: "首頁", href: "/" },
          { label: "旅遊分享", href: "/travel-community" },
          { label: post.title },
        ]}
      />

      <section className="space-y-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
          <div className="flex flex-col rounded-[32px] border border-[#CDA870] bg-white shadow-sm">
            <div className="relative w-full pb-[80%] min-h-[320px] overflow-hidden rounded-[32px] border border-[#CDA870]/40 bg-[#F4F1EC] p-1">
              <div className="absolute inset-0">
              {galleryImages.length > 0 && (
                <img
                  src={galleryImages[activeImage]}
                  alt={post.title}
                  className="h-full w-full rounded-[28px] object-cover"
                />
              )}
              </div>
              <button
                onClick={goPrevImage}
                disabled={galleryImages.length <= 1}
                className={`absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-[#CDA870] px-3 py-1 text-lg font-semibold shadow ${
                  galleryImages.length > 1
                    ? "bg-white/95 text-[#1F2E3C]"
                    : "cursor-default bg-white/60 text-[#C3B79F]"
                }`}
                aria-label="上一張"
              >
                &lt;
              </button>
              <button
                onClick={goNextImage}
                disabled={galleryImages.length <= 1}
                className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-[#CDA870] px-3 py-1 text-lg font-semibold shadow ${
                  galleryImages.length > 1
                    ? "bg-white/95 text-[#1F2E3C]"
                    : "cursor-default bg-white/60 text-[#C3B79F]"
                }`}
                aria-label="下一張"
              >
                &gt;
              </button>
            </div>
            <div className="flex justify-center gap-3 px-6 py-4">
              {galleryImages.length > 0 ? (
                galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-2.5 w-2.5 rounded-full ${
                      idx === activeImage
                        ? "bg-[#1F2E3C]"
                        : "bg-[#CDA870]/40 hover:bg-[#CDA870]"
                    }`}
                    aria-label={`第 ${idx + 1} 張`}
                  />
                ))
              ) : (
                <span className="text-xs text-gray-400">尚無圖片</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:h-full lg:pr-2">
            <div className="space-y-5 rounded-[28px] border border-[rgba(31,46,60,0.08)] bg-white p-8 shadow-sm flex-1 min-h-[320px]">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#4B5563]">
                  {locationLabel ? `${locationLabel}｜` : ""}
                  {post.type}
                </div>
                <Bookmark size={18} className="text-[#CDA870]" />
              </div>
              <h1 className="text-3xl font-bold text-[#1F2E3C] leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-sm text-[#4B5563]">
                <span>
                  作者：<span className="font-semibold">{post.author}</span>
                </span>
                <span>時間：{publishedAt}</span>
              </div>

              <article className="space-y-5 text-[15px] leading-7 text-[#1F2E3C]/85 max-h-[360px] lg:max-h-[calc(100vh-420px)] overflow-y-auto pr-2">
                {post.content
                  .split("\n")
                  .filter((paragraph) => paragraph.trim().length > 0)
                  .map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
              </article>

              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--sw-primary)]/5 px-3 py-1 text-xs text-[var(--sw-primary)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-[28px] border border-[#CDA870] bg-white px-6 py-4 text-sm text-[#0F2740] shadow-sm lg:mt-auto">
              <span className="inline-flex items-center gap-2 font-medium">
                <Heart size={18} className="text-[#B2773C]" />
                28 個喜歡
              </span>
              <span className="inline-flex items-center gap-2 font-medium">
                <MessageCircle size={18} className="text-[#0F2740]" />
                {comments.length} 則評論
              </span>
              <span className="inline-flex items-center gap-2 font-medium">
                <Bookmark size={18} className="text-[#0F2740]" />
                8 個收藏
              </span>
              <button className="inline-flex items-center gap-2 font-medium text-[#0F2740] transition hover:text-[#C08A46]">
                <Share2 size={18} />
                分享
              </button>
              <button className="ml-auto inline-flex items-center text-[#0F2740] transition hover:text-[#C08A46]">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[rgba(31,46,60,0.08)] bg白 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle size={18} className="text-[#DCBB87]" />
            <h2 className="text-lg font-semibold text-[#1F2E3C]">
              旅客迴響（{comments.length} 則）
            </h2>
          </div>
          <div className="mb-5">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="分享你的看法..."
              className="w-full rounded-2xl border border-[rgba(31,46,60,0.12)] p-3 text-sm text-[#1F2E3C] focus:outline-none focus:ring-2 focus:ring-[#DCBB87]"
              rows={3}
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleAddComment}
                className="rounded-full bg-[#1F2E3C] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#DCBB87] hover:text-[#1F2E3C]"
              >
                送出留言
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-2xl border border-[#F0E6D8] p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#1F2E3C]">
                      {comment.author}
                      {(comment.isAuthor || isAuthorName(comment.author)) && (
                        <span className="rounded-full bg-[#CDA870] px-2 py-0.5 text-[10px] font-semibold text-[#1F2E3C]">
                          作者
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {comment.createdAt}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#1F2E3C]/85">{comment.content}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <button
                    onClick={() => {
                      setReplyTarget(comment.id);
                      setReplyText("");
                      setReplyAsAuthor(false);
                    }}
                    className="rounded-full border border-[#CDA870] px-3 py-1 text-[#8D6A37] hover:bg-[#FDF6EC]"
                  >
                    回覆
                  </button>
                </div>

                {comment.replies?.length ? (
                  <div className="mt-4 space-y-3 border-t border-[#F0E6D8] pt-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <img
                          src={reply.avatar}
                          alt={reply.author}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="rounded-2xl bg-[#F9F6F0] px-4 py-2 text-sm leading-relaxed text-[#1F2E3C]">
                          <div className="mb-1 flex items-center gap-2 text-xs font-semibold">
                            {reply.author}
                            {(reply.isAuthor || isAuthorName(reply.author)) && (
                              <span className="rounded-full bg-[#CDA870] px-2 py-0.5 text-[10px] font-semibold text-[#1F2E3C]">
                                作者
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400">
                              {reply.createdAt}
                            </span>
                          </div>
                          <p className="text-sm text-[#1F2E3C]/85">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {replyTarget === comment.id && (
                  <div className="mt-4 space-y-2 rounded-2xl border border-[#F0E6D8] bg-[#FFFBF4] p-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="回覆這則留言..."
                      className="w-full rounded-xl border border-[#E2CDA1] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCBB87]"
                      rows={3}
                    />
                    <button
                      type="button"
                      onClick={() => setReplyAsAuthor((prev) => !prev)}
                      className="flex items-center gap-2 text-xs text-[#6B4B2B]"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-[4px] border ${
                          replyAsAuthor
                            ? "border-[#1F2E3C] bg-[#1F2E3C] text-white"
                            : "border-[#CDA870] bg-white text-transparent"
                        }`}
                      >
                        <Check size={12} />
                      </span>
                      以作者身份回覆
                    </button>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setReplyTarget(null);
                          setReplyText("");
                          setReplyAsAuthor(false);
                        }}
                        className="rounded-full border border-[#E2CDA1] px-4 py-1 text-sm text-[#6B4B2B]"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleReplySubmit}
                        className="rounded-full bg-[#DCBB87] px-4 py-1 text-sm font-semibold text-[#1F2E3C] hover:bg-[#C5A064]"
                      >
                        送出回覆
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#1F2E3C]">
              <span className="text-sm font-semibold tracking-[0.2em] text-[#DCBB87]">
                MORE
              </span>
              <h3 className="text-xl font-bold">相關分享</h3>
            </div>
            <Masonry posts={relatedPosts} />
          </div>
        )}
      </section>
      <FloatingWriteButton />
    </main>
  );
}
