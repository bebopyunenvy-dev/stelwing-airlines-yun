'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <>
      <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
        {/* Portal：入口網站的意思，所有要談出的內容及畫面，會傳送到 body 層，讓內容保證蓋在所有內容最上層 */}
        <AlertDialog.Portal>
          {/* Overlay：蓋掉畫面的半透明層，目前一樣設定為固定位置、佔滿全畫面、黑色半透明 50% */}
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-900" />
          {/* Content：彈出視窗本體，目前設定：固定位置、置中畫面、背景白色、padding-6、圓角 */}
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ticket-red rounded-lg p-6 z-950">
            {/* Title：彈出視窗標題 */}
            <AlertDialog.Title className="text-lg font-bold">
              {title}
            </AlertDialog.Title>
            {/* Description：描述 */}
            <AlertDialog.Description className="mt-2 text-sm text-(--sw-gray)">
              {description}
            </AlertDialog.Description>
            {/* 自己用 div 把按鈕包成一包 */}
            <div className="mt-8 flex justify-end gap-2">
              {/* Cancel：取消操作 */}
              <AlertDialog.Cancel className="sw-btn">取消</AlertDialog.Cancel>
              {/* Action：執行操作 */}
              <AlertDialog.Action
                className="sw-btn sw-btn--red-square"
                onClick={onConfirm}
              >
                {confirmText}
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}
