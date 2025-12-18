'use client';

import { useState } from 'react';
import { timezones } from '../src/data/timezone';
// @ts-expect-error 我不寫就跳錯我只好加啊氣死
import { DateTime } from 'luxon';
import { useAlertDialog } from '../components/alertDialog/useAlertDialog';
import { Trip } from '../types';
import { apiFetch } from '../utils/apiFetch';
import AlertDialogBox from './alertDialog/alertDialogBox';

// export interface CreatePlanFormProps {}
// {}: CreatePlanFormProps

export default function CreatePlanForm({
  onSuccess,
}: {
  onSuccess: (newTripId: string) => void;
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const { alert, showAlert } = useAlertDialog();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    startTimezone: '',
    endDate: '',
    endTimezone: '',
    note: '',
    // coverImage: '',
  });

  // 功能：監看欄位變化
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 功能：結束日期不得早於開始日期
  const handleStartDateChange = (newStartDate: string) => {
    setFormData((prev) => {
      const correctedEndDate =
        // 如果原本的結束日期已經設定、不是 undefined，而且早於開始日期，則把結束日期改為新的開始日期，如果等於或晚於開始日期就沒問題，使用原本的結束日期
        prev.endDate && prev.endDate < newStartDate
          ? newStartDate
          : prev.endDate;
      return { ...prev, startDate: newStartDate, endDate: correctedEndDate };
    });
  };

  // 功能：處理檔案上傳
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);

    // 不要在這裡更新 formData.coverImage
    // 等裁切完成後再存
  };

  // 功能：表單送出
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // 先處理日期
      const startDateTime = DateTime.fromISO(formData.startDate, {
        zone: formData.startTimezone,
      }).startOf('day');
      const endDateTime = DateTime.fromISO(formData.endDate, {
        zone: formData.endTimezone,
      }).startOf('day');

      // 用 FormData 取代 JSON
      const form = new FormData();
      form.append('title', formData.title);
      form.append('destination', formData.destination);
      form.append('startDate', startDateTime.toUTC().toISO());
      form.append('startTimezone', formData.startTimezone);
      form.append('endDate', endDateTime.toUTC().toISO());
      form.append('endTimezone', formData.endTimezone);
      form.append('note', formData.note);

      // 加上檔案
      if (croppedPreview) {
        const res = await fetch(croppedPreview);
        const blob = await res.blob();
        form.append('coverImage', blob, file?.name || 'cover.jpg');
      } else if (file) {
        form.append('coverImage', file);
      }

      // POST
      const data = await apiFetch<Trip>(`http://localhost:3007/api/plans`, {
        // const data = await apiFetch(`${API_BASE}/plans`, {
        method: 'POST',
        body: form,
      });

      showAlert({
        title: '新增成功',
        description: '點擊確認跳轉行程規劃頁面',
        confirmText: '確認',
        onConfirm: () => onSuccess(data.id),
      });
    } catch (err: any) {
      showAlert({
        title: '新增失敗',
        description: err.message || '請稍後再試',
        confirmText: '確認',
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-3">
        {/* 旅程標題 */}
        <div className="sw-l-input">
          <label htmlFor="title">旅程標題</label>
          <input
            id="title"
            name="title"
            type="text"
            onChange={handleChange}
            required
          />
        </div>
        {/* 目的地 */}
        <div className="sw-l-input">
          <label htmlFor="destination">目的地</label>
          <input
            id="destination"
            name="destination"
            type="text"
            onChange={handleChange}
          />
        </div>
        {/* 開始日期及時區 */}
        <div className="flex gap-4">
          <div className="flex-1 sw-l-input">
            <label htmlFor="startDate">開始日期</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              required
            />
          </div>
          <div className="flex-2 sw-l-input">
            <label htmlFor="startTimezone">開始日期時區</label>
            <select
              id="startTimezone"
              name="startTimezone"
              value={formData.startTimezone}
              onChange={handleChange}
              required
            >
              <option value="">選擇時區 ⭣</option>
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.city} {tz.code} - {tz.country}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* 結束日期及時區 */}
        <div className="flex gap-4">
          <div className="flex-1 sw-l-input">
            <label htmlFor="endDate">結束日期</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              min={formData.startDate || undefined}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex-2 sw-l-input">
            <label htmlFor="endTimezone">結束日期時區</label>
            <select
              id="endTimezone"
              name="endTimezone"
              value={formData.endTimezone}
              onChange={handleChange}
              required
            >
              <option value="">選擇時區 ⭣</option>
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.city} {tz.code} - {tz.country}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* 備註 */}
        <div className="flex-1 sw-l-input">
          <label htmlFor="note">備註 (選填)</label>
          <textarea
            id="note"
            name="note"
            rows={3}
            onChange={handleChange}
          ></textarea>
        </div>
        {/* 封面照片 */}
        {/* <div className="flex gap-4 items-start"> */}
        {/* <div className="flex-1 sw-l-input">
            <label htmlFor="coverImage" className="block mb-1">
              封面照片 (選填：支援 jpg / png，大小上限 5MB)
            </label> */}
        {/* 真正的檔案輸入 */}
        {/* <input
              id="coverImage"
              // name="coverImage"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                 file:rounded-md file:border file:border-gray-300
                 file:text-sm file:font-semibold
                 file:bg-gray-100 file:text-gray-700
                 hover:file:bg-gray-200"
            /> */}

        {/* 預覽圖片 */}
        {/* {preview && !croppedPreview && (
              <div>
                <div className="relative w-80 h-80 bg-gray-100">
                  <Cropper
                    image={preview}
                    crop={crop}
                    zoom={zoom}
                    aspect={2 / 3} // 1:1 正方形裁切
                    cropShape="rect" // 視覺圓形遮罩
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, croppedAreaPixels) =>
                      setCroppedAreaPixels(croppedAreaPixels)
                    }
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={async () => {
                    if (!preview || !croppedAreaPixels) return;
                    const croppedImage = await getCroppedImg(
                      preview,
                      croppedAreaPixels
                    );
                    setCroppedPreview(croppedImage);

                    // setFormData((prev) => ({
                    //   ...prev,
                    //   coverImage: croppedImage,
                    // }));
                  }}
                >
                  完成裁切
                </button>
              </div> */}
        {/* )} */}
        {/* 顯示裁切後的圖片 */}
        {/* {croppedPreview && (
              <div className="mt-2">
                <img
                  src={croppedPreview}
                  alt="裁切後封面"
                  className="w-40 h-60 object-cover rounded-full border border-gray-300"
                />
              </div>
            )} */}
        {/* </div>
        </div> */}
        {/* 儲存按鈕 */}
        <div className="flex justify-end">
          <button type="submit" className="sw-btn sw-btn--gold-square">
            確認新增
          </button>
        </div>
      </form>
      {/* 彈出視窗 / 整包套件：刪除結果訊息 */}
      {alert.open && <AlertDialogBox alert={alert} />}
    </>
  );
}
