'use client';

import clsx from 'clsx';
import {
  Armchair,
  ArrowLeftRight,
  Calendar,
  ChevronDown,
  Plane,
  Ticket,
  User,
  type Icon as LucideIcon,
} from 'lucide-react';
import React from 'react';

export type IconName =
  | 'chevron-down'
  | 'plane'
  | 'calendar'
  | 'user'
  | 'seat'
  | 'ticket'
  | 'swap';

const ICONS: Record<IconName, typeof LucideIcon> = {
  'chevron-down': ChevronDown,
  plane: Plane,
  calendar: Calendar,
  user: User,
  seat: Armchair,
  ticket: Ticket,
  swap: ArrowLeftRight,
};

export interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  title?: string;
}

export function Icon({
  name,
  size = 18,
  className,
  strokeWidth = 2,
  title,
  ...rest
}: IconProps & Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'>) {
  const Comp = ICONS[name];
  const px = typeof size === 'number' ? `${size}px` : size;
  return (
    <Comp
      iconNode={[]}
      width={px}
      height={px}
      strokeWidth={strokeWidth}
      className={clsx('inline-block align-middle', className)}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      {...rest}
    />
  );
}
