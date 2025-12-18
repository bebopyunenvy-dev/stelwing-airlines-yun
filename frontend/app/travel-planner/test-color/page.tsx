'use client';

// export interface TestColorPageProps {

// }

export default function TestColorPage() {
  const categories = [
    { name: '航班', bgColor: '#1f2e3c', textColor: '#ffffff' },
    { name: '餐廳', bgColor: '#D7B894', textColor: '#000000' },
    { name: '住宿', bgColor: '#CFC9C2', textColor: '#000000' },

    { name: '交通', bgColor: '#A2A98F', textColor: '#000000' },
    { name: '活動', bgColor: '#C97C5D', textColor: '#ffffff' },
    { name: '購物', bgColor: '#E3D5CA', textColor: '#000000' },

    { name: '自然', bgColor: '#7A8C77', textColor: '#ffffff' },
    { name: '文化', bgColor: '#8B6F5A', textColor: '#ffffff' },
    { name: '咖啡', bgColor: '#A47551', textColor: '#ffffff' },

    { name: '其他', bgColor: '#B8B2A6', textColor: '#000000' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">顏色的表</h1>

      <div className="flex gap-4">
        {categories.map((c) => (
          <div key={c.name} className="flex flex-col gap-2">
            {/* 第一個 div：背景 = bgColor，文字 = textColor */}
            <div
              style={{
                backgroundColor: c.bgColor,
                color: c.textColor,
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
              }}
            >
              {c.name}
            </div>

            {/* 第二個 div：透明背景 + 黑字 + bgColor 邊框 */}
            <div
              style={{
                backgroundColor: 'transparent',
                color: '#000000',
                padding: '10px 20px',
                border: `2px solid ${c.bgColor}`,
                borderRadius: '6px',
              }}
            >
              {c.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
