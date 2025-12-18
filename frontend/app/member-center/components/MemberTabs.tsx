"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

const tabs = [
  { key: "info", label: "會員資訊", path: "/member-center" },
  { key: "flights", label: "機票訂單", path: "/member-center/flight" },
  { key: "hotels", label: "住宿訂單", path: "/member-center/hotel" },
  { key: "dutyfree", label: "免稅商品訂單", path: "/member-center/dutyfree" },
];

export default function MemberTabs() {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === "/member-center") return "info"
    if (pathname.includes("/flight")) return "flights"
    if (pathname.includes("/hotel")) return "hotels"
    if (pathname.includes("/dutyfree")) return "dutyfree"
    return "info"
  };

  const activeTab = getActiveTab();

  return (
    <div className="flex w-full border-b-2 border-[#CDA870]">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.key
        return (
          <Link
            key={tab.key}
            href={tab.path}
            className={`relative flex-1 h-[48px] -mb-[2px] flex items-center justify-center px-8 text-center text-base lg:text-lg font-semibold tracking-[-0.02em] transition-all duration-150 border border-[#CDA870] border-b-0 rounded-t-[8px]
              ${index > 0 ? "-ml-[1px]" : ""}
              ${isActive ? "bg-[#DCBB87] text-[#1F2E3C]" : "bg-white text-[#1F2E3C]"}
            `}
          >
            <span className="relative z-10">{tab.label}</span>
          </Link>
        )
      })}
    </div>
  );
}
