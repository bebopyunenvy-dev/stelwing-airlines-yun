'use client';

import InfoCard from '../ui/InfoCard';

interface CheckedLuggageItem {
  category: string;
  weight: string;
  dimensions: string;
  pieces: string;
}

interface CheckedLuggageCardProps {
  data: CheckedLuggageItem[];
}

const CheckedLuggageCard = ({ data }: CheckedLuggageCardProps) => {
  return (
    <InfoCard badgeText="入境與轉機規定">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        {data.map((item, idx) => (
          <div key={idx}>
            <h3 className="font-bold text-black mb-1">{item.category}</h3>
            <p>• 重量：{item.weight}</p>
            <p>• 尺寸：{item.dimensions}</p>
            <p>• 件數：{item.pieces}</p>
          </div>
        ))}
      </div>
    </InfoCard>
  );
};

export default CheckedLuggageCard;
