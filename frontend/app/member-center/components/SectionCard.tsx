import type { ReactNode } from "react"

interface SectionCardProps {
  title?: string
  children: ReactNode
  className?: string
  headerClassName?: string
  bodyClassName?: string
}

export default function SectionCard({
  title,
  children,
  className = "",
  headerClassName = "",
  bodyClassName = "",
}: SectionCardProps) {
  return (
    <div className={`bg-white border border-[#E5E5E5] rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className={`bg-[#DCBB87] px-6 py-3 ${headerClassName}`}>
          <h3 className="text-[#1F2E3C] font-medium">{title}</h3>
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
