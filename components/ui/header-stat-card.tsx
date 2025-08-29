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
        style={{
          display: 'flex',
          width: '290px',
          minWidth: '166.667px',
          padding: '16.667px 20px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '6.667px',
          borderRadius: '13.333px',
          border: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <div className="text-sm text-black-500">{title}</div>
        <div className="flex justify-between items-end w-full">
          <div className="text-2xl font-bold text-black">{value}</div>
          <p className="text-[10px] text-gray-500">{subtitle}</p>
        </div>
      </div>
    </>
  );
}