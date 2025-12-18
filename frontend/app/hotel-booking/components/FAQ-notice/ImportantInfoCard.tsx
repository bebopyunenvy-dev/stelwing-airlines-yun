'use client';

import InfoCard from '../ui/InfoCard';

interface ImportantInfoCardProps {
  data: {
    transportation: string[];
    facilities: string[];
    shopping: string[];
  };
}

const ImportantInfoCard = ({ data }: ImportantInfoCardProps) => {
  return (
    <InfoCard badgeText="一般遊客注意事項">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
        <div>
          <h3 className="font-bold text-black mb-2">交通主意事項</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.transportation.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-black mb-2">用餐購物</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.facilities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-black mb-2">購物須知</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.shopping.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </InfoCard>
  );
};

export default ImportantInfoCard;
