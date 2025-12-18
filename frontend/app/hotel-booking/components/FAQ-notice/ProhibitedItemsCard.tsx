'use client';

import InfoCard from '../ui/InfoCard';

interface ProhibitedItemsCardProps {
  data: { category: string; items: string[] }[];
}

const ProhibitedItemsCard = ({ data }: ProhibitedItemsCardProps) => {
  return (
    <InfoCard badgeText="禁止攜帶物品">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        {data.map((group, idx) => (
          <div key={idx}>
            <h3 className="font-bold text-black mb-2">{group.category}</h3>
            <ul className="list-disc pl-5 space-y-1">
              {group.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </InfoCard>
  );
};

export default ProhibitedItemsCard;
