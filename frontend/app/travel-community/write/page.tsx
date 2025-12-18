// app/travel-community/write/page.tsx
'use client';
import Breadcrumb from '@/app/components/Breadcrumb';
import { useToast } from '@/app/context/toast-context';
import { apiFetch } from '@/app/travel-community/utils/apiFetch';
import {
  ArrowLeft,
  Book,
  Camera,
  Eye,
  Hash,
  ImagePlus,
  Send,
  Video,
} from 'lucide-react'; //新增
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'; //新增
import { tagOptions } from '../data/posts';

type ImageItem = {
  file: File;
  preview: string;
};

export default function TravelWritePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [tab, setTab] = useState<'travelogue' | 'video' | 'photo'>(
    'travelogue'
  );

  // 共用狀態
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [location, setLocation] = useState('');

  // 各別內容狀態
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3007/api';

  console.log('API_BASE =', API_BASE); //測試

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      showToast({
        type: 'info',
        title: '請先登入',
        message: '登入後即可撰寫旅遊分享。',
      });
      router.replace('/member-center/login');
      return;
    }
    setCanEdit(true);
  }, [router, showToast]);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const MAX_TAGS = 3;

  const handleAddTag = (tagValue?: string) => {
    const targetTag = (tagValue ?? newTag).trim();
    if (!targetTag) return;
    if (tags.includes(targetTag)) {
      setNewTag('');
      return;
    }

    if (tags.length >= MAX_TAGS) {
      showToast({
        type: 'info',
        title: '標籤上限',
        message: `最多選擇 ${MAX_TAGS} 個標籤，請先移除再新增。`,
      });
      return;
    }

    setTags((prev) => [...prev, targetTag]);
    if (!tagValue) setNewTag('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...selected]);
  };

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleSubmit = async () => {
    if (!location.trim()) {
      alert('請輸入旅遊的國家或城市');
      return;
    }

    if (!title.trim() && tab !== 'photo') {
      alert('請輸入標題');
      return;
    }

    const travelContent = content.trim();
    const snapshotContent = photoCaption.trim();
    const videoContent = videoDescription.trim();

    const articleContent =
      tab === 'travelogue'
        ? travelContent
        : tab === 'video'
          ? videoContent
          : snapshotContent;

    if (!articleContent) {
      alert('請輸入內容');
      return;
    }

    const media =
      tab === 'video'
        ? videoUrl
          ? [
              {
                mediaType: 'video' as const,
                mediaUrl: videoUrl,
                orderIndex: 0,
              },
            ]
          : []
        : await Promise.all(
            images.map(async (img, index) => ({
              mediaType: 'image' as const,
              mediaUrl: await fileToDataUrl(img.file),
              mimeType: img.file.type,
              fileSizeMb: +(img.file.size / (1024 * 1024)).toFixed(4),
              orderIndex: index,
            }))
          );

    if (!media.length) {
      alert('請至少上傳一張圖片或提供影片連結');
      return;
    }

    const payload = {
      title: title.trim(),
      content: articleContent,
      tags,
      postType: tab,
      location: location.trim(),
      media,
      videoUrl: tab === 'video' ? videoUrl : undefined,
    };

    try {
      setSubmitting(true);
      await apiFetch('http://localhost:3007/api/travel-community', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      alert('已送出旅遊分享！');
      router.push('/travel-community');
    } catch (error: any) {
      console.error('送出旅遊分享失敗', error);
      alert(error.message ?? '送出失敗，請稍後再試。');
    } finally {
      setSubmitting(false);
    }
  };

  const tabLabel =
    tab === 'travelogue' ? '遊記' : tab === 'video' ? '影片' : '隨手拍';
  const travelPreview = content.trim();
  const videoPreview = videoDescription.trim();
  const photoPreview = photoCaption.trim();
  const previewBody =
    tab === 'photo'
      ? photoPreview || '還沒寫下照片故事。'
      : tab === 'video'
        ? videoPreview || '還沒撰寫影片描述。'
        : travelPreview || '還沒撰寫內容。';
  const previewMediaHint =
    tab === 'video'
      ? videoUrl
        ? '影片連結已貼上'
        : '尚未貼上影片連結'
      : images.length
        ? `已選擇 ${images.length} 張圖片`
        : '尚未上傳圖片';

  if (!canEdit) {
    return null;
  }

  return (
    <>
      <main className="mx-auto w-full max-w-[1312px] space-y-6 px-4 lg:px-0 text-[#1F2E3C]">
        <Breadcrumb
          items={[
            { label: '首頁', href: '/' },
            { label: '旅遊分享', href: '/travel-community' },
            { label: '撰寫分享' },
          ]}
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full rounded-[28px] border border-[#BA9A60] bg-white p-6 text-sm text-[#1F2E3C]/70 lg:w-[240px] lg:rounded-[32px] lg:border-r">
            <div className="mb-8 flex items-center gap-2 text-lg font-bold text-[#1F2E3C]">
              <Book className="text-[#DCBB87]" size={20} />
              開始分享
            </div>
            <nav className="flex flex-col gap-6">
              <a className="hover:text-[#DCBB87] transition-colors">收藏管理</a>
              <a className="hover:text-[#DCBB87] transition-colors">發表列表</a>
              <a className="hover:text-[#DCBB87] transition-colors">通知列表</a>
            </nav>
          </aside>

          <section className="relative flex-1 rounded-[32px] border border-[#DCBB87] bg-white p-10 shadow-sm">
            {/* 返回按鈕 */}
            <button
              onClick={() => router.push('/travel-community')}
              className="absolute right-10 top-10 flex items-center gap-2 text-sm text-[#1F2E3C]/70 hover:text-[#DCBB87]"
            >
              <ArrowLeft size={16} />
              返回分享列表
            </button>

            <h1 className="mb-6 text-2xl font-bold text-[#1F2E3C]">
              {tab === 'travelogue'
                ? '發表遊記'
                : tab === 'video'
                  ? '發表影片'
                  : '隨手拍分享'}
            </h1>

            {/* Tabs */}
            <div className="mb-8 flex gap-4">
              {[
                { key: 'travelogue', label: '遊記', icon: <Book size={16} /> },
                { key: 'video', label: '影片', icon: <Video size={16} /> },
                { key: 'photo', label: '隨手拍', icon: <Camera size={16} /> },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as any)}
                  className={`flex items-center gap-2 rounded-md border px-6 py-2 ${
                    tab === t.key
                      ? 'border-[#DCBB87] bg-[#DCBB87] text-white'
                      : 'border-[#DCBB87] text-[#1F2E3C] hover:bg-[#DCBB87]/10'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            {/* ===== 標題 & 標籤（遊記／影片用） ===== */}
            {(tab === 'travelogue' || tab === 'video') && (
              <div className="mb-6">
                <label className="block text-sm mb-2 text-[#1F2E3C]/80">
                  標題
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`請輸入${tab === 'video' ? '影片' : '文章'}標題`}
                  className="w-full border border-[#DCBB87] rounded-md p-3 text-sm focus:ring-1 focus:ring-[#DCBB87] outline-none"
                />
              </div>
            )}

            {/* 旅遊地點 */}
            <div className="mb-6">
              <label className="block text-sm mb-2 text-[#1F2E3C]/80">
                旅遊國家／城市
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="例如：日本 東京"
                className="w-full border border-[#DCBB87] rounded-md p-3 text-sm focus:ring-1 focus:ring-[#DCBB87] outline-none"
              />
            </div>

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
                  type="button"
                  onClick={() => handleAddTag()}
                  className="px-4 py-2 bg-[#DCBB87] text-white rounded-md hover:bg-[#BA9A60]"
                >
                  新增
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 text-sm border border-[#DCBB87] rounded-full text-[#1F2E3C]/80 bg-[#FFF7EE]"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) => prev.filter((item) => item !== tag))
                      }
                      className="text-xs text-[#8C6231] hover:text-[#5A3B1F]"
                      aria-label={`移除標籤 ${tag}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-[#1F2E3C]/60">
                最多選擇 {MAX_TAGS} 個標籤，可不填。
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tagOptions.map((tag) => {
                  const disabled =
                    tags.includes(tag) || tags.length >= MAX_TAGS;
                  return (
                    <button
                      key={tag}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleAddTag(tag)}
                      className={`rounded-full border px-3 py-1 text-sm transition ${
                        disabled
                          ? 'border-[#DCBB87]/40 text-[#1F2E3C]/30 cursor-not-allowed'
                          : 'border-[#DCBB87] text-[#1F2E3C]/80 hover:bg-[#DCBB87]/10'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ===== 遊記：內容 + 圖片 ===== */}
            {tab === 'travelogue' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm mb-2 text-[#1F2E3C]/80">
                    文章內容
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="今天想寫些什麼..."
                    className="w-full h-[240px] border border-[#DCBB87] rounded-md p-3 text-sm resize-none focus:ring-1 focus:ring-[#DCBB87] outline-none"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-2 text-[#1F2E3C]/80 flex items-center gap-2">
                    <ImagePlus size={16} className="text-[#DCBB87]" /> 上傳圖片
                  </label>

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
                          key={`${img.file.name}-${i}`}
                          className="flex h-[120px] items-center justify-center overflow-hidden rounded-md border border-[#DCBB87]"
                        >
                          <img
                            src={img.preview}
                            alt={img.file.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ===== 影片 ===== */}
            {tab === 'video' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm mb-2 text-[#1F2E3C]/80">
                    影片內容
                  </label>
                  <textarea
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="分享這支影片想說的故事或重點。"
                    className="w-full h-[180px] border border-[#DCBB87] rounded-md p-3 text-sm resize-none focus:ring-1 focus:ring-[#DCBB87] outline-none"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm mb-2 text-[#1F2E3C]/80">
                    影片連結 (YouTube)
                  </label>
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
                        src={videoUrl.replace('watch?v=', 'embed/')}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ===== 隨手拍 ===== */}
            {tab === 'photo' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm mb-2 text-[#1F2E3C]/80">
                    想說些什麼？
                  </label>
                  <textarea
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="今天拍到什麼有趣的畫面？"
                    className="w-full h-[120px] border border-[#DCBB87] rounded-md p-3 text-sm resize-none focus:ring-1 focus:ring-[#DCBB87] outline-none"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-2 text-[#1F2E3C]/80">
                    上傳圖片
                  </label>
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
                          key={`${img.file.name}-${i}`}
                          className="flex h-[120px] items-center justify-center overflow-hidden rounded-md border border-[#DCBB87]"
                        >
                          <img
                            src={img.preview}
                            alt={img.file.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* 按鈕列 */}
            <div className="flex justify-end gap-4 mt-10">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 border border-[#DCBB87] text-[#1F2E3C] px-6 py-2 rounded-md hover:bg-[#DCBB87]/10"
              >
                <Eye size={16} /> 預覽
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-md bg-[#DCBB87] px-6 py-2 text-white hover:bg-[#BA9A60] disabled:cursor-not-allowed disabled:bg-[#E2CDA1]"
              >
                <Send size={16} /> {submitting ? '送出中...' : '送出'}
              </button>
            </div>
          </section>
        </div>
      </main>
      <PreviewModal
        open={showPreview}
        mode={tab}
        onClose={() => setShowPreview(false)}
        tabLabel={tabLabel}
        title={title || `未命名${tabLabel}`}
        body={previewBody}
        tags={tags}
        mediaHint={previewMediaHint}
        videoUrl={videoUrl}
        images={images}
      />
    </>
  );
}

interface PreviewModalProps {
  open: boolean;
  mode: 'travelogue' | 'video' | 'photo';
  onClose: () => void;
  tabLabel: string;
  title: string;
  body: string;
  tags: string[];
  mediaHint: string;
  videoUrl: string;
  images: ImageItem[];
}

function PreviewModal({
  open,
  mode,
  onClose,
  tabLabel,
  title,
  body,
  tags,
  mediaHint,
  videoUrl,
  images,
}: PreviewModalProps) {
  if (!open) return null;
  const firstImage = images[0];
  const moreCount = Math.max(images.length - 1, 0);
  const embedUrl =
    videoUrl && videoUrl.includes('watch?v=')
      ? videoUrl.replace('watch?v=', 'embed/')
      : videoUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-[32px] bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between border-b border-[#F1E8DC] pb-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-[#DCBB87]">
              PREVIEW
            </p>
            <p className="text-sm text-[#1F2E3C]/60">送出前先檢查看看</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-[#DCBB87] px-4 py-1 text-sm text-[#1F2E3C] hover:bg-[#FDF6EC]"
          >
            關閉
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="rounded-[28px] border border-[#EAD9C2] bg-[#FFFBF4] p-4">
            {mode === 'video' && embedUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-[20px] border border-[#DCBB87]/40 bg-black/80">
                <iframe
                  src={embedUrl}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            ) : firstImage ? (
              <div className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-[20px] border border-[#DCBB87]/70 bg-white">
                <img
                  src={firstImage.preview}
                  alt={firstImage.file.name}
                  className="h-full w-full object-cover"
                />
                {moreCount > 0 && (
                  <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                    +{moreCount}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex h-[320px] items-center justify-center rounded-[20px] border border-dashed border-[#DCBB87]/70 bg-white text-sm text-[#1F2E3C]/60">
                {mediaHint}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-[#FDF6EC] px-3 py-1 text-xs font-semibold text-[#C08A46]">
              {tabLabel}
            </span>
            <h3 className="text-2xl font-bold text-[#1F2E3C]">{title}</h3>
            <p className="whitespace-pre-wrap text-sm leading-7 text-[#1F2E3C]/85">
              {body}
            </p>
            {mode === 'video' && videoUrl && (
              <p className="text-xs text-[#1F2E3C]/60">影片連結：{videoUrl}</p>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#DCBB87] px-3 py-1 text-xs text-[#1F2E3C]/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
