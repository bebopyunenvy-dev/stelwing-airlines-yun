'use client';

import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

export default function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const categories = [
    { id: 1, name: '航班', bgColor: '#1f2e3c', textColor: '#ffffff' },
    { id: 2, name: '餐廳', bgColor: '#D7B894', textColor: '#000000' },
    { id: 3, name: '住宿', bgColor: '#CFC9C2', textColor: '#000000' },
    { id: 4, name: '交通', bgColor: '#A2A98F', textColor: '#000000' },
    { id: 5, name: '活動', bgColor: '#C97C5D', textColor: '#ffffff' },
    { id: 6, name: '購物', bgColor: '#E3D5CA', textColor: '#000000' },
    { id: 7, name: '自然', bgColor: '#7A8C77', textColor: '#ffffff' },
    { id: 8, name: '文化', bgColor: '#8B6F5A', textColor: '#ffffff' },
    { id: 9, name: '咖啡', bgColor: '#A47551', textColor: '#ffffff' },
    { id: 10, name: '其他', bgColor: '#B8B2A6', textColor: '#000000' },
  ];

  const selected = categories.find((c) => String(c.id) === value);

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="w-[200px] flex items-center justify-between px-4 py-1 rounded-md border border-(--sw-grey)">
        {/* 左側：顏色點 + 文字 */}
        <div className="flex items-center gap-2">
          {selected && (
            <span
              className="inline-block h-3 w-3 rounded"
              style={{ backgroundColor: selected.bgColor }}
            />
          )}

          {/* Radix 會自動塞入 <Select.ItemText> 的內容 */}
          <Select.Value placeholder="選擇分類" />
        </div>

        {/* 下箭頭 */}
        <Select.Icon>
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="bg-white rounded-md shadow-md p-2 z-600">
          <Select.Viewport>
            {categories.map((c) => (
              <Select.Item
                key={c.id}
                value={String(c.id)}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                {/* 顏色點 */}
                <span
                  className="inline-block h-3 w-3 rounded"
                  style={{ backgroundColor: c.bgColor }}
                />

                {/* Radix 用來顯示在 Trigger 的文字 */}
                <Select.ItemText>{c.name}</Select.ItemText>

                {/* 選中時右邊的勾勾 */}
                <Select.ItemIndicator className="ml-auto">
                  <Check />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
