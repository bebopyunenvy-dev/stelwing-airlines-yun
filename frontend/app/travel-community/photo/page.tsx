"use client";

import { useState } from "react";
import { Camera, Send, Eye } from "lucide-react";

export default function PhotoWritePage() {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = () => {
    alert("隨手拍已送出！(之後可接 API)");
  };

  return (
    <div className="flex bg-[#F8F8F8] min-h-screen text-[#1F2E3C]">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-[#BA9A60] flex flex-col p-6 gap-8">
        <div className="text-[#1F2E3C] font-bold text-lg flex items-center gap-2">
          <Camera className="text-[#DCBB87]" size={20} />
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
          <h1 className="text-2xl font-bold mb-6 text-[#1F2E3C]">隨手拍分享</h1>

          {/* Caption */}
          <div className="mb-6">
            <label className="block text-sm mb-2 text-[#1F2E3C]/80">想說些什麼？</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="今天拍到什麼有趣的畫面？"
              className="w-full h-[120px] border border-[#DCBB87] rounded-md p-3 text-sm resize-none focus:ring-1 focus:ring-[#DCBB87] outline-none"
            ></textarea>
          </div>

          {/* Upload */}
          <div className="mb-6">
            <label className="block text-sm mb-2 text-[#1F2E3C]/80">上傳圖片</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="block w-full text-sm text-[#1F2E3C]/70 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#DCBB87]/10 file:text-[#1F2E3C] hover:file:bg-[#DCBB87]/20"
            />
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="border border-[#DCBB87] rounded-md overflow-hidden h-[120px] flex items-center justify-center text-sm text-[#1F2E3C]/50"
                  >
                    {img.name}
                  </div>
                ))}
              </div>
            )}
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
              <Send size={16} /> 送出分享
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
