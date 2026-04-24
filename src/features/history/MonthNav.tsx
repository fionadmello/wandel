import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthNavProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export function MonthNav({ year, month, onPrev, onNext }: MonthNavProps) {
  const now = new Date();
  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth() + 1;

  const label = format(new Date(year, month - 1, 1), "MMMM yyyy");

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <button
        type="button"
        onClick={onPrev}
        className="p-1 text-muted bg-transparent border-none cursor-pointer"
        aria-label="Previous month"
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>

      <p className="font-sans text-[13px] font-medium text-plum">{label}</p>

      <button
        type="button"
        onClick={onNext}
        disabled={isCurrentMonth}
        className={`p-1 bg-transparent border-none ${isCurrentMonth ? "text-soft cursor-default" : "text-muted cursor-pointer"}`}
        aria-label="Next month"
      >
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}
