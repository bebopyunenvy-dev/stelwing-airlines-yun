import { Suspense } from 'react';
import FlightInfoBar from './components/FlightInfoBar';

export default function FlightBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {/* FlightInfoBar 如果要滿版 → 放在這層外面 */}
      <Suspense fallback={null}>
        <FlightInfoBar />
      </Suspense>

      {/* 版心寬度 */}
      <Suspense fallback={null}>
        <div className="mx-auto w-full max-w-[1586px] px-16 py-4">
          {children}
        </div>
      </Suspense>
    </div>
  );
}
