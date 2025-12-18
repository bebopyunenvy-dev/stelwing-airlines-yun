import { FileX } from "lucide-react"

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "尚無紀錄" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-[#C5C8C8]">
      <FileX size={64} className="mb-4" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
