'use client';

import InfoCard from '../ui/InfoCard';

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface BookingProcessCardProps {
  data: ProcessStep[];
}

const BookingProcessCard = ({ data }: BookingProcessCardProps) => {
  return (
    <InfoCard badgeText="機場流程指南">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-sm text-gray-700">
        {data.map((item, idx) => (
          <div key={idx} className="text-center">
            <h3 className="font-bold text-black mb-2">{item.step}</h3>
            <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
            <p className="text-xs text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </InfoCard>
  );
};

export default BookingProcessCard;
