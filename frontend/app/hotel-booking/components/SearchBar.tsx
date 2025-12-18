'use client';

import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Calendar, { DateRange } from './Calendar';

interface SearchBarProps {
  selectedRange?: DateRange;
  onDateChange?: (range: DateRange | undefined) => void;
  guests: number;
  onGuestsChange: (newGuests: number) => void;
  rooms: number;
  onRoomsChange: (newRooms: number) => void;
}

export default function SearchBar({
  selectedRange,
  onDateChange,
  guests,
  onGuestsChange,
  rooms,
  onRoomsChange,
}: SearchBarProps) {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const formatDate = (date: Date | undefined, placeholder: string) => {
    // ✅ 確保當日期為 undefined 或無效時，顯示 placeholder
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return placeholder;
    }

    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (onDateChange) onDateChange(range);
  };

  const handleSearch = () => {
    if (!selectedRange?.from || !selectedRange?.to) {
      alert('請選擇入住與退房日期');
      return;
    }

    const checkin = selectedRange.from.toISOString().split('T')[0];
    const checkout = selectedRange.to.toISOString().split('T')[0];
    localStorage.setItem('scrollToHotelId', '1');

    router.push(
      `/hotel-booking/search?checkin=${checkin}&checkout=${checkout}&adults=${guests}&rooms=${rooms}`
    );
  };

  // ✅ 新增：檢查是否有選擇日期
  const hasSelectedDates = selectedRange?.from && selectedRange?.to;

  return (
    <>
      <div className="text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center text-xl mb-8 font-medium">
            提尋機場內及周邊 1 公里內的優質住宿
          </h1>

          {/* 搜尋欄 */}
          <div className="flex flex-wrap justify-center gap-3 py-4 relative">
            {/* 日期區 */}
            <div className="flex items-center bg-white rounded-lg gap-0 overflow-hidden">
              {/* Check in */}
              <button
                className={`bg-white px-6 w-[180px] py-[10px] flex items-center justify-start gap-3 hover:bg-gray-50 transition-colors ${
                  hasSelectedDates ? 'text-gray-800' : 'text-gray-400'
                }`}
                onClick={() => setShowCalendar(true)}
              >
                <CalendarIcon size={20} className="text-gray-600" />
                <span className="font-medium truncate">
                  {formatDate(selectedRange?.from, 'Check in')}
                </span>
              </button>

              <div className="w-[1px] h-6 bg-gray-400 mx-0.5"></div>

              {/* Check out */}
              <button
                className={`bg-white px-6 w-[180px] py-[10px] flex items-center justify-start gap-3 hover:bg-gray-50 transition-colors ${
                  hasSelectedDates ? 'text-gray-800' : 'text-gray-400'
                }`}
                onClick={() => setShowCalendar(true)}
              >
                <CalendarIcon size={20} className="text-gray-600" />
                <span className="font-medium truncate">
                  {formatDate(selectedRange?.to, 'Check out')}
                </span>
              </button>
            </div>

            {/* 人數/房間 */}
            <button
              className="bg-white text-gray-800 px-6 py-[10px] rounded-lg flex items-center gap-3 hover:bg-gray-50 transition-colors min-w-[180px]"
              onClick={() => setShowGuestPicker(!showGuestPicker)}
            >
              <Users size={20} className="text-gray-600" />
              <span className="font-medium">
                {guests} Adults / {rooms} room
              </span>
            </button>

            {/* 人數選擇器彈窗 */}
            {showGuestPicker && (
              <div className="absolute top-[70px] right-0 bg-white text-gray-800 rounded-lg shadow-lg p-4 z-50 w-[220px]">
                {/* 成人 */}
                <div className="flex justify-between items-center mb-2">
                  <span>成人</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onGuestsChange(Math.max(1, guests - 1))}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{guests}</span>
                    <button
                      onClick={() => onGuestsChange(guests + 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 房間 */}
                <div className="flex justify-between items-center mb-2">
                  <span>房間</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRoomsChange(Math.max(1, rooms - 1))}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{rooms}</span>
                    <button
                      onClick={() => onRoomsChange(rooms + 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => setShowGuestPicker(false)}
                    className="px-4 py-1 bg-[#D4A574] text-white rounded-full hover:bg-[#C69563] transition-colors"
                  >
                    確認
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 搜尋按鈕 */}
          <div className="w-full flex justify-center mt-2">
            <button
              onClick={handleSearch}
              className="bg-[#D4A574] hover:bg-[#C69563] text-white font-semibold px-8 py-1 rounded-full transition-all hover:shadow-lg active:scale-95"
            >
              搜尋
            </button>
          </div>
        </div>
      </div>

      {/* 日曆彈窗 */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCalendar(false)}
          />
          <div className="relative bg-white rounded-lg p-5 shadow-2xl max-w-4xl w-full z-10">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center z-20"
            >
              ×
            </button>
            <Calendar selected={selectedRange} onSelect={handleDateSelect} />
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowCalendar(false)}
                className="px-6 py-1 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowCalendar(false)}
                className="px-6 py-1 bg-[#D4A574] hover:bg-[#C69563] text-white rounded-full transition-colors"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        :root {
          --calendar-primary: #a88352;
          --calendar-selected: #a88352;
          --calendar-muted: #bfa789;
          --calendar-range: rgba(168, 131, 82, 0.15);
          --calendar-past: #cccccc;
        }
      `}</style>
    </>
  );
}
