"use client";

import { useState } from "react";
import { Video, Hash, Send, Eye } from "lucide-react";

export default function VideoWritePage() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleSubmit = () => {
    alert("影片文章已送出！(之後可接 API)");
  };

  return (
    <div className="flex bg-[#F8F8F8] min-h-screen text-[#1F2E3C]">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-[#BA9A60] flex flex-col p-6 gap-8">
        <div className="text-[#1F2E3C] font-bold text-lg flex items-center gap-2">
          <Video className="text-[#DCBB87]" size={20} />
          開始分享
        </div>
        <nav className="flex flex-col gap-6 text-sm text-[#1F2E3C]/70">
          <a href="#" className="hover:text-[#DCBB87] transition-colors">收藏管理</a>
          <a href="#" className="hover:text-[#DCBB87] transition-colors">發表列表</a>
          <a href="#" className="hover:text-[#DCBB87] transition-colors">通知列表</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex justify-center py-10">
        <div className="w-[1024px] bg-white border border-[#DCBB87] rounded-lg p-10 shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-[#1F2E3C]">發表影片</h1>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm mb-2 text-[#1F2E3C]/80">影片標題</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="請輸入影片標題"
              className="w-full border border-[#DCBB87] rounded-md p-3 text-sm focus:ring-1 focus:ring-[#DCBB87] outline-none"
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm mb-2 text-[#1F2E3C]/80 flex items-center gap-2">
              <Hash size={16} className="text-[#DCBB87]" /> 標籤
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="請輸入標籤"
                className="flex-1 border border-[#DCBB87] rounded-md p-2 text-sm focus:ring-1 focus:ring-[#DCBB87] outline-none"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-[#DCBB87] text-white rounded-md hover:bg-[#BA9A60]"
              >
                新增
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 text-sm border border-[#DCBB87] rounded-full text-[#1F2E3C]/80">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Video URL */}
          <div className="mb-6">
            <label className="block text-sm mb-2 text-[#1F2E3C]/80">影片連結 (YouTube)</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="請貼上影片連結"
              className="w-full border border-[#DCBB87] rounded-md p-3 text-sm focus:ring-1 focus:ring-[#DCBB87] outline-none"
            />
            {videoUrl && (
              <div className="mt-4 aspect-video w-full border border-[#DCBB87] rounded-md overflow-hidden">
                <iframe
                  src={videoUrl.replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm mb-2 text-[#1F2E3C]/80">說明文字</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="這部影片想分享的內容..."
              className="w-full h-[160px] border border-[#DCBB87] rounded-md p-3 text-sm resize-none focus:ring-1 focus:ring-[#DCBB87] outline-none"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-10">
            <button className="flex items-center gap-2 border border-[#DCBB87] text-[#1F2E3C] px-6 py-2 rounded-md hover:bg-[#DCBB87]/10">
              <Eye size={16} /> 預覽
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-[#DCBB87] text-white px-6 py-2 rounded-md hover:bg-[#BA9A60]"
            >
              <Send size={16} /> 送出影片
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
