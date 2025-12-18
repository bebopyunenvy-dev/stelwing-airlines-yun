'use client';

import InfoCard from '../ui/InfoCard';

interface SafetyTipsCardProps {
  data: {
    highRisk: string[];
    tips: string[];
    notice: string;
  };
}

const SafetyTipsCard = ({ data }: SafetyTipsCardProps) => {
  return (
    <InfoCard badgeText="治安提醒">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          <h3 className="font-bold text-black mb-2">高風險地區</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.highRisk.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-black mb-2">安全注意事項</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.tips.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      {data.notice && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700 font-bold text-sm mb-2">注意</p>
          <p className="text-red-600 text-sm">{data.notice}</p>
        </div>
      )}
    </InfoCard>
  );
};

export default SafetyTipsCard;
