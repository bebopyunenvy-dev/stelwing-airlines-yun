'use client';

import InfoCard from '../ui/InfoCard';

interface EmergencyNumbersCardProps {
  data: {
    emergency: string[];
    other: {
      name: string;
      address: string;
      phone: string;
      emergencyPhone: string;
    };
  };
}

const EmergencyNumbersCard = ({ data }: EmergencyNumbersCardProps) => {
  return (
    <InfoCard badgeText="緊急聯絡電話">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">
        <div>
          <h3 className="font-bold text-black mb-2">緊急服務</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.emergency.map((item, i) => (
              <li key={i} className="text-base">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-black mb-2">其他服務</h3>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">現地址：</span>
              {data.other.address}
            </p>
            <p>
              <span className="font-semibold">電話：</span>
              {data.other.phone}
            </p>
            <p className="text-red-600">
              <span className="font-semibold">📞 急難救助：</span>
              {data.other.emergencyPhone}
            </p>
          </div>
        </div>
      </div>
    </InfoCard>
  );
};

export default EmergencyNumbersCard;
