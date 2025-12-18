"use client";

export default function OrderFrame({
  title,
  children,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#CDA870] rounded-[16px] bg-white shadow-sm overflow-hidden">
      {title && (
        <div className="bg-[#F8F2E6] border-b border-[#E3CFA2] px-6 py-3 text-[#1F2E3C] font-semibold">
          {title}
        </div>
      )}
      <div className="p-0">{children}</div>
    </div>
  );
}
