'use client';

import { useState } from 'react';
import Cropper from 'react-easy-crop';
import AlertDialogBox from '../components/alertDialog/alertDialogBox';
import { useAlertDialog } from '../components/alertDialog/useAlertDialog';
import { apiFetch } from '../utils/apiFetch';
import { getCroppedImg } from '../utils/image';

export default function ChangeCoverButton({
  tripId,
  onUpdated,
}: {
  tripId: string;
  onUpdated: (newCoverUrl: string | null) => void;
}) {
  // 狀態
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const { alert, showAlert } = useAlertDialog();

  type UpdateCoverResponse = {
    success: boolean;
    message: string;
    coverImage: string;
  };

  // 1. 使用者選圖片
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 2. 完成裁切
  const handleCropDone = async () => {
    if (!preview || !croppedAreaPixels) return;

    const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
    setCroppedPreview(croppedImage);
  };

  // 3. 送出更新
  const submitCroppedImage = async () => {
    if (!croppedPreview) return;

    setUploading(true);
    try {
      // Base64 → Blob
      const blob = await (await fetch(croppedPreview)).blob();

      const formData = new FormData();
      formData.append('cover', blob, 'cover.jpg');

      const data = await apiFetch<UpdateCoverResponse>(
        `http://localhost:3007/api/plans/${tripId}/cover`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      console.log(data);

      showAlert({
        title: '封面更新成功',
        description: '封面圖片已完成更新',
        confirmText: '確認',
        onConfirm: () => onUpdated(data.coverImage),
      });
    } catch (err: any) {
      showAlert({
        title: '封面更新失敗',
        description: err.message || '請稍後再試',
        confirmText: '確認',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 選檔案 */}
      {/* <label className="sw-btn sw-btn--gold-square cursor-pointer">
        {uploading ? '上傳中...' : '從電腦中選擇圖片'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </label> */}

      <div className="flex-1 sw-l-input">
        <label htmlFor="coverImage" className="block mb-1 cursor-pointer">
          {uploading ? '上傳中...' : '從電腦中選擇圖片'}
        </label>
        {/* 真正的檔案輸入 */}
        <input
          id="coverImage"
          // name="coverImage"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                 file:rounded-md file:border file:border-gray-300
                 file:text-sm file:font-semibold
                 file:bg-gray-100 file:text-gray-700
                 hover:file:bg-gray-200"
        />
      </div>

      {/* 預覽 + 裁切器 */}
      {preview && !croppedPreview && (
        <div className="flex flex-col items-center">
          <div className="relative w-80 h-80 bg-gray-100">
            <Cropper
              image={preview}
              crop={crop}
              zoom={zoom}
              aspect={2 / 3}
              showGrid={false}
              cropShape="rect"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, area) => setCroppedAreaPixels(area)}
            />
          </div>

          <button
            className="sw-btn sw-btn--gold-square mt-6"
            onClick={handleCropDone}
          >
            完成裁切
          </button>
        </div>
      )}

      {/* 完成裁切後顯示結果 */}
      {croppedPreview && (
        <div className="flex flex-col items-center">
          <img
            src={croppedPreview}
            className="w-40 h-60 object-cover rounded-full"
          />

          <button
            className="sw-btn sw-btn--gold-square  mt-6"
            onClick={submitCroppedImage}
          >
            上傳封面
          </button>
        </div>
      )}

      {alert.open && <AlertDialogBox alert={alert} />}
    </div>
  );
}
