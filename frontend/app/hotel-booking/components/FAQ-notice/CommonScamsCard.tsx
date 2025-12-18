'use client';

import InfoCard from '../ui/InfoCard';

interface CommonScamsCardProps {
  data: {
    street: string[];
    online: string[];
  };
}

const CommonScamsCard = ({ data }: CommonScamsCardProps) => {
  return (
    <InfoCard badgeText="常見詐騙手法">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          <h3 className="font-bold text-black mb-2">街頭詐騙</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.street.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-black mb-2">網路詐騙</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.online.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </InfoCard>
  );
};

export default CommonScamsCard;
