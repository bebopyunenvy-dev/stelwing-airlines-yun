'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AlertState } from './types';

export interface AlertDialogBoxProps {
  alert: AlertState;
}

export default function AlertDialogBox({ alert }: AlertDialogBoxProps) {
  return (
    <>
      <AlertDialog.Root open={alert.open}>
        <AlertDialog.Portal>
          {/* 背後的黑色遮罩 */}
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-900" />
          {/* 訊息視窗本體 */}
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ticket rounded-xl p-6 shadow-xl w-[90%] max-w-sm z-950">
            <AlertDialog.Title className="text-lg font-semibold">
              {alert.title}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-gray-600">
              {alert.description}
            </AlertDialog.Description>
            <div className="flex justify-end mt-4">
              <AlertDialog.Action
                className="sw-btn--gold-square text-white rounded px-4 py-2"
                onClick={alert.onConfirm}
              >
                {alert.confirmText}
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}
