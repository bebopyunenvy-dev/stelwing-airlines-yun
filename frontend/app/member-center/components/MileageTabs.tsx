"use client";

export default function MileageTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const tabs = [
    { key: "rule", label: "哩程說明" },
    { key: "detail", label: "哩程明細" },
  ];

  return (
    <div className="flex w-full mt-8 border-b-2 border-[#CDA870]">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            className={`relative flex-1 h-[48px] -mb-[2px] flex items-center justify-center px-8 text-center text-base lg:text-lg font-semibold tracking-[-0.02em] transition-all duration-150 border border-[#CDA870] border-b-0 rounded-t-[8px]
              ${index > 0 ? "-ml-[1px]" : ""}
              ${isActive ? "bg-[#DCBB87] text-[#1F2E3C]" : "bg-white text-[#1F2E3C]"}
            `}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
