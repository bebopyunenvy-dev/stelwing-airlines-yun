'use client';

import InfoCard from '../ui/InfoCard';

interface CarryOnCardProps {
  data: {
    category: string;
    dimensions: string;
    weight: string;
    liquids: string;
  };
}

const CarryOnCard = ({ data }: CarryOnCardProps) => {
  return (
    <InfoCard badgeText="隨身行李限制">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          <h3 className="font-bold text-black mb-1">{data.category}</h3>
          <p>• 尺寸：{data.dimensions}</p>
          <p>• 重量：{data.weight}</p>
          <p>• 液體：{data.liquids}</p>
        </div>
        <div className="flex items-center justify-center text-gray-500 text-xs md:text-sm">
          ※ 液體須符合「每瓶不超過100ml，總量不超過1公升」
        </div>
      </div>
    </InfoCard>
  );
};

export default CarryOnCard;
