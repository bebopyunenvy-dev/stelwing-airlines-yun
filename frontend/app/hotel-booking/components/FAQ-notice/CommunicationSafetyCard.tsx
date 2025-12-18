'use client';

import InfoCard from '../ui/InfoCard';

interface CommunicationSafetyCardProps {
  data: {
    internet: string[];
    emergency: string[];
  };
}

const CommunicationSafetyCard = ({ data }: CommunicationSafetyCardProps) => {
  return (
    <InfoCard badgeText="通訊安全">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          <h3 className="font-bold text-black mb-2">網路使用</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.internet.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-black mb-2">緊急聯絡</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.emergency.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </InfoCard>
  );
};

export default CommunicationSafetyCard;
