'use client';

import { ReactNode } from 'react';

interface InfoCardProps {
  title?: string;
  badgeText?: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  borderRadius?: string;
  padding?: string;
  children: ReactNode;
}

export default function InfoCard({
  title,
  badgeText,
  bgColor = 'bg-white',
  borderColor = 'border-[#dcba83]',
  textColor = 'text-black',
  badgeBgColor = 'bg-[#967f5c]',
  badgeTextColor = 'text-white',
  borderRadius = 'rounded-sm',
  padding = 'p-4',
  children,
}: InfoCardProps) {
  return (
    <div
      className={`${bgColor} ${borderColor} border ${borderRadius} ${padding} shadow space-y-4`}
    >
      {badgeText && (
        <div
          className={`${badgeBgColor} ${badgeTextColor} inline-block px-5 py-1 rounded-lg font-bold text-sm`}
        >
          {badgeText}
        </div>
      )}
      {title && <h3 className={`font-bold ${textColor}`}>{title}</h3>}
      <div className={textColor}>{children}</div>
    </div>
  );
}
