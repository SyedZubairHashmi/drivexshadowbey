import type { LucideIcon } from "lucide-react";

interface HeaderStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

export function HeaderStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
}: HeaderStatCardProps) {
  return (
    <>
      <div 
        className={`flex flex-col items-start gap-2 rounded-[13.333px] border border-black/10 transition-all 
        2xl:w-[290px] xl:w-[260px] lg:w-[220px] w-[220px]
        2xl:px-5 2xl:py-4 xl:px-5 xl:py-4 lg:px-4 lg:py-3 px-4 py-3 ${className || ''}`}
      >
        <div className="text-black-500 2xl:text-sm xl:text-[13px] lg:text-xs text-xs">{title}</div>
        <div className="flex justify-between items-end w-full">
          <div className="text-black font-bold 2xl:text-2xl xl:text-2xl lg:text-xl text-xl">{value}</div>
          <p className="text-gray-500 2xl:text-[10px] xl:text-[10px] lg:text-[9px] text-[9px]">{subtitle}</p>
        </div>
      </div>
    </>
  );
}