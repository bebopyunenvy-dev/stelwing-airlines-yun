'use client';

import InfoCard from '../ui/InfoCard';

interface CustomsRulesCardProps {
  data: {
    dutyFree: string[];
    prohibited: string[];
    notice: string;
  };
}

export const CustomsRulesCard = ({ data }: CustomsRulesCardProps) => {
  return (
    <InfoCard badgeText="海關申報規則">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          <h3 className="font-bold text-black mb-2">免稅額度</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.dutyFree.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-black mb-2">需申報物品</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.prohibited.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          {data.notice && (
            <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 font-semibold text-xs">注意</p>
              <p className="text-red-600 text-xs mt-1">{data.notice}</p>
            </div>
          )}
        </div>
      </div>
    </InfoCard>
  );
};
