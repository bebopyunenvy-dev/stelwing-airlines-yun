'use client';

import InfoCard from '../ui/InfoCard';

interface PowerSpecsCardProps {
  data: {
    voltage: {
      standard: string;
      frequency: string[];
    };
    plugTypes: {
      primary: string;
      secondary: string;
      recommendation: string;
    };
  };
}

const PowerSpecsCard = ({ data }: PowerSpecsCardProps) => {
  return (
    <InfoCard badgeText="電壓與插座規格">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          <h3 className="font-bold text-black mb-2">電壓規格</h3>
          <p className="mb-1">• 電壓：{data.voltage.standard}</p>
          <p>• 頻率：{data.voltage.frequency.join(' / ')}</p>
        </div>
        <div>
          <h3 className="font-bold text-black mb-2">插座類型</h3>
          <p className="mb-1">• 類型A：{data.plugTypes.primary}</p>
          <p className="mb-1">• 類型B：{data.plugTypes.secondary}</p>
          <p>• {data.plugTypes.recommendation}</p>
        </div>
      </div>
    </InfoCard>
  );
};

export default PowerSpecsCard;
