'use client';

import InfoCard from '../ui/InfoCard';

interface EmbassyInfo {
  name: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  hours: string;
}

interface EmbassyContactCardProps {
  data: EmbassyInfo[];
}

const EmbassyContactCard = ({ data }: EmbassyContactCardProps) => {
  return (
    <InfoCard badgeText="托運行李限制">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">
        {data.map((embassy, idx) => (
          <div key={idx}>
            <h3 className="font-bold text-black mb-3 text-base">
              {embassy.name}
            </h3>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">地址：</span>
                {embassy.address}
              </p>
              <p>
                <span className="font-semibold">電話：</span>
                {embassy.phone}
              </p>
              <p className="text-red-600">
                <span className="font-semibold">📞 急難救助：</span>
                {embassy.emergencyPhone}
              </p>
              <p>
                <span className="font-semibold">服務時間：</span>
                {embassy.hours}
              </p>
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  );
};

export default EmbassyContactCard;
