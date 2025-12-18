'use client';

import InfoCard from '../ui/InfoCard';

interface FinancialSafetyCardProps {
  data: {
    creditCard: string[];
    cashTips: string[];
  };
}

const FinancialSafetyCard = ({ data }: FinancialSafetyCardProps) => {
  return (
    <InfoCard badgeText="金融安全">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          <h3 className="font-bold text-black mb-2">信用卡使用</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.creditCard.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-black mb-2">現金提領</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.cashTips.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </InfoCard>
  );
};

export default FinancialSafetyCard;
