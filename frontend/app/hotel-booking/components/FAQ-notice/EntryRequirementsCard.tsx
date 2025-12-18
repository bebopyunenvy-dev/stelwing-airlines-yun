'use client';

import InfoCard from '../ui/InfoCard';

interface EntryRequirementsCardProps {
  data: {
    documents: string[];
    stayPeriod: string[];
    transfer: string[];
  };
}

const EntryRequirementsCard = ({ data }: EntryRequirementsCardProps) => {
  return (
    <InfoCard badgeText="入境與轉機規定">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
        <div>
          <h3 className="font-bold text-black mb-2">入境所需文件</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.documents.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-black mb-2">停留期限</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.stayPeriod.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-black mb-2">轉機資訊</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.transfer.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </InfoCard>
  );
};

export default EntryRequirementsCard;
