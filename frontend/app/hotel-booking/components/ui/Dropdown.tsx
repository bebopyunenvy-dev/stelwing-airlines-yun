'use client';

import { useEffect, useRef, useState } from 'react';

interface DropdownProps {
  options: string[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function Dropdown({
  options,
  value,
  placeholder = '請選擇',
  onChange,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 過濾選項
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 點擊外部關閉
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 鍵盤操作
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(
        (prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleSelect = (opt: string) => {
    onChange?.(opt);
    setIsOpen(false);
    setSearchTerm('');
  };

  const displayValue = isOpen ? searchTerm : value || '';

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* 輸入框 + 下拉按鈕 */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg
            text-gray-700 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#DCBB87] focus:border-[#DCBB87]
            transition-all duration-200
          `}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* 下拉選單 */}
      {isOpen && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <li
                key={opt}
                onClick={() => handleSelect(opt)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`
                  px-4 py-2 cursor-pointer transition-colors
                  ${idx === highlightedIndex ? 'bg-[#DCBB87] text-white' : 'hover:bg-[#DCBB87]/10'}
                  ${value === opt && !isOpen ? 'bg-[#DCBB87]/20 font-medium' : ''}
                `}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500 italic">無符合選項</li>
          )}
        </ul>
      )}
    </div>
  );
}
