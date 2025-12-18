'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, { useCallback, useState } from 'react';
import ConfirmDialog from './confirmDialog';

export interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function EditDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: EditDialogProps) {
  const [isOpenCloseComfirm, setIsOpenCloseComfirm] = useState(false);
  const handleEditDialogClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <>
      <Dialog.Root
        open={open}
        // onOpenChange={onOpenChange}
        onOpenChange={(next) => {
          if (!next) {
            // 用戶正在嘗試關閉 → 不直接關閉 → 改跳 confirm
            setIsOpenCloseComfirm(true);
            return;
          }
          onOpenChange(true);
        }}
      >
        {/* Portal：入口網頁，所有彈出相關內容 */}
        <Dialog.Portal>
          {/* Overlay：背景遮罩 */}
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-500" />
          {/* Content：彈出視窗 */}
          <Dialog.Content className="sw-dialog fixed w-[90vw] max-w-[600px] h-[90vh] max-h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ticket pl-6 pr-3 py-6 rounded-lg shadow-lg flex flex-col z-550">
            {title && (
              <Dialog.Title className="sw-h5 mb-3">{title}</Dialog.Title>
            )}
            {description && (
              <Dialog.Description className="text-sm text-gray-500 mb-4">
                {description}
              </Dialog.Description>
            )}

            {/* 傳進來的 form 元件放這裡 */}
            {children}

            <button
              type="button"
              aria-label="關閉編輯視窗"
              className="absolute top-2 right-4 text-gray-600 hover:text-black"
              onClick={() => setIsOpenCloseComfirm(true)}
            >
              ✕
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {/* 彈出視窗 / UI 套件：確認是否關閉 */}
      <ConfirmDialog
        open={isOpenCloseComfirm}
        onOpenChange={setIsOpenCloseComfirm}
        title={'確定要關閉編輯視窗嗎？'}
        description={'輸入的內容尚未儲存'}
        confirmText={'確認關閉'}
        onConfirm={handleEditDialogClose}
      />
    </>
  );
}
