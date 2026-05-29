import type { AccentColor } from "@/constants/accentClasses";
import { ACCENT_TEXT } from "@/constants/accentClasses";

interface PanelHeaderProps {
  number: number;
  title: string;
  subtitle: string;
  accent: AccentColor;
  action?: React.ReactNode;
}

export function PanelHeader({
  number,
  title,
  subtitle,
  accent,
  action,
}: PanelHeaderProps) {
  const paddedNumber = String(number).padStart(2, "0");

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`font-sans text-[10px] font-medium tracking-widest uppercase ${ACCENT_TEXT[accent]}`}
      >
        {paddedNumber}
      </span>
      <div className="flex justify-between items-center">
        <span className="font-serif text-[22px] font-semibold leading-[1.1] text-plum">
          {title}
        </span>
        {action}
      </div>
      <span className="font-sans text-[11px] text-muted tracking-[0.02em]">
        {subtitle}
      </span>
    </div>
  );
}
