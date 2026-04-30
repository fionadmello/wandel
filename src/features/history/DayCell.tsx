import { format } from "date-fns";

interface DayCellProps {
  date: string;
  day: number;
  hasMirror: boolean;
  hasSmoking: boolean;
  hasExercise: boolean;
  hasSlip: boolean;
  isFuture: boolean;
  onTap: () => void;
}

export function DayCell({
  date,
  day,
  hasMirror,
  hasSmoking,
  hasExercise,
  hasSlip,
  isFuture,
  onTap,
}: DayCellProps) {
  const hasData = hasMirror || hasSmoking || hasExercise || hasSlip;
  const today = format(new Date(), "yyyy-MM-dd");
  const isActualToday = date === today;

  return (
    <button
      type="button"
      onClick={!isFuture ? onTap : undefined}
      className={`flex flex-col items-center justify-center gap-[3px] rounded-xl py-2 min-h-[52px] w-full border-none
        ${isActualToday ? "border border-amber" : "border border-transparent"}
        ${hasData && !isFuture ? "bg-soft cursor-pointer" : "bg-transparent"}
        ${isFuture ? "cursor-default opacity-30" : "cursor-pointer"}
      `}
    >
      <span
        className={`font-sans text-[12px] leading-none ${isActualToday ? "text-amber font-medium" : "text-plum"}`}
      >
        {day}
      </span>
      <div className="flex gap-[3px]">
        {hasMirror && (
          <span className="w-[5px] h-[5px] rounded-full bg-violet" />
        )}
        {hasSmoking && (
          <span className="w-[5px] h-[5px] rounded-full bg-teal" />
        )}
        {hasExercise && (
          <span className="w-[5px] h-[5px] rounded-full bg-amber" />
        )}
        {hasSlip && <span className="w-[5px] h-[5px] rounded-full bg-slip" />}
      </div>
    </button>
  );
}
