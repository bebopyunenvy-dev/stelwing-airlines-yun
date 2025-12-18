'use client';

import { ReactNode } from 'react';
import { TripProvider } from '../../src/context/TripContext';

export default function TravelPlannerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TripProvider>
      <div className="max-w-[1568px] mx-auto w-full px-4 flex flex-1">
        {children}
      </div>
    </TripProvider>
  );
}
