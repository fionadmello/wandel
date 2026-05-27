import { dotOpacity, dotSize } from "@/constants/bdaDotScale";

interface BdaDotProps {
  value: number;
  label: string;
}

export function BdaDot({ value, label }: BdaDotProps) {
  const size = dotSize(value);
  const opacity = dotOpacity(value);
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="rounded-full bg-gold"
        style={{ width: size, height: size, opacity }}
      />
      <span className="font-sans text-[9px] uppercase tracking-[0.06em] text-muted">
        {label}
      </span>
    </div>
  );
}
