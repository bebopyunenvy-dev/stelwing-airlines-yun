'use client';

import InfoCard from '../ui/InfoCard';

interface AssistanceCenter {
  name: string;
  details: string[];
}

interface TravelAssistanceCardProps {
  data: AssistanceCenter[];
}

const TravelAssistanceCard = ({ data }: TravelAssistanceCardProps) => {
  return (
    <InfoCard badgeText="一般遊客注意事項">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
        {data.map((center, idx) => (
          <div key={idx}>
            <h3 className="font-bold text-black mb-2">{center.name}</h3>
            <ul className="list-disc pl-5 space-y-1">
              {center.details.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </InfoCard>
  );
};

export default TravelAssistanceCard;
