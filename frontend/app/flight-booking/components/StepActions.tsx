'use client';

import clsx from 'clsx';

type Props = {
  className?: string;
  onPrev?: () => void;
  onNext?: () => void;
  prevText?: string;
  nextText?: string;
  nextDisabled?: boolean;
};

export default function StepActions({
  className,
  onPrev,
  onNext,
  prevText = '上一步',
  nextText = '下一步',
  nextDisabled = false,
}: Props) {
  return (
    <div
      className={clsx(
        'w-full flex items-center justify-between gap-3 mt-8',
        className
      )}
    >
      <button
        type="button"
        onClick={onPrev}
        className="sw-btn sw-btn--grey-primary"
      >
        {prevText}
      </button>

      {/* 下一步：金色主按鈕（.sw-btn--gold-primary） */}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={clsx(
          'sw-btn sw-btn--gold-primary',
          nextDisabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {nextText}
      </button>
    </div>
  );
}
