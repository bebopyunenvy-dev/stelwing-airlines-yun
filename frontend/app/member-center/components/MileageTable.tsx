"use client";

import OrderFrame from "./OrderFrame";

export default function MileageTable() {
  // 之後會改成後端撈資料
  const mockData = [
    { id: 1, type: "累積", amount: 1250, balance: 3580, date: "2024-10-15 14:30" },
    { id: 2, type: "兌換", amount: -500, balance: 2330, date: "2024-09-20 10:15" },
    { id: 3, type: "累積", amount: 2100, balance: 2830, date: "2024-08-12 16:45" },
  ];

  return (
    <OrderFrame>
      <div className="border border-[#BA9A60] rounded-xl overflow-hidden">
      {/* 表頭 */}
      <div className="bg-[#1F2E3C] text-white text-sm grid grid-cols-4 py-3 px-6 font-medium">
        <div>ID</div>
        <div>類型</div>
        <div>哩程變動</div>
        <div>交易日期</div>
      </div>

      {/* 表身 */}
      {mockData.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-4 px-6 py-4 border-b border-[#E5E5E5] text-sm"
        >
          <div>#{row.id.toString().padStart(3, "0")}</div>
          <div>{row.type}</div>
          <div
            className={`font-medium ${
              row.amount > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {row.amount > 0 ? `+${row.amount}` : row.amount}
          </div>
          <div>{row.date}</div>
        </div>
      ))}
      </div>
    </OrderFrame>
  );
}
