interface DFStatusTagProps {
  status:
    | 'success'
    | 'error'
    | 'pending'
    | 'processing'
    | 'cancelled'
    | 'refunding'
    | 'refunded';
  label: string;
}

export function DFStatusTag({ status, label }: DFStatusTagProps) {
  const statusStyles = {
    success:
      'bg-green-50 text-[var(--df-state-success)] border-[var(--df-state-success)]',
    error:
      'bg-red-50 text-[var(--df-state-error)] border-[var(--df-state-error)]',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-700',
    processing: 'bg-blue-50 text-blue-700 border-blue-700',
    cancelled: 'bg-gray-50 text-gray-500 border-gray-500',
    refunding:
      'bg-red-50 text-[var(--df-state-error)] border-[var(--df-state-error)]',
    refunded: 'bg-blue-50 text-blue-700 border-blue-700',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded border text-sm ${statusStyles[status]}`}
    >
      {label}
    </span>
  );
}
