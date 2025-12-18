'use client';

import { useState } from 'react';

interface SearchViewProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function SearchView({
  placeholder = '關鍵字',
  value = '',
  onChange,
  onKeyDown,
  className = '',
}: SearchViewProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange?.(val);
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.('');
  };

  const hasValue = inputValue.length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* 搜尋圖示（移到外層） */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
        <svg
          className="w-5 h-5 text-[#DCBB87]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input 框（只留左 padding） */}
      <input
        type="search"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`
          w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg
          text-gray-700 placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-[#DCBB87] focus:border-[#DCBB87]
          transition-all duration-200
        `}
      />

      {/* 清除按鈕 */}
      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
