import { format, parse } from "date-fns";
import { Calendar } from "lucide-react";

interface DateSelectorProps {
  value: string;
  onChange: (date: string) => void;
}

export function DateSelector({ value, onChange }: DateSelectorProps) {
  const today = format(new Date(), "yyyy-MM-dd");
  const displayDate = format(
    parse(value, "yyyy-MM-dd", new Date()),
    "EEEE, d MMMM",
  );

  return (
    <div className="relative inline-flex items-center gap-1.5 cursor-pointer">
      <span className="font-serif italic text-[15px] text-muted">
        {displayDate}
      </span>
      <Calendar size={12} className="text-muted shrink-0" />
      <input
        type="date"
        value={value}
        max={today}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
        aria-label="Change date"
      />
    </div>
  );
}
