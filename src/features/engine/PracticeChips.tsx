import { usePractices } from "@/hooks/usePractices";
import type { Practice } from "@/types/engine";

interface PracticeChipsProps {
  userId: string;
  onSelect: (practice: Practice) => void;
}

export function PracticeChips({ userId, onSelect }: PracticeChipsProps) {
  const { data: practices = [] } = usePractices(userId);
  const active = practices.filter((p) => p.active);

  return (
    <div className="flex gap-2 overflow-x-auto">
      {active.map((practice) => (
        <button
          key={practice.id}
          type="button"
          onClick={() => onSelect(practice)}
          className="bg-card rounded-full px-4 py-2 font-sans text-[12px] text-plum font-medium shadow-sm shrink-0"
        >
          {practice.name}
        </button>
      ))}
    </div>
  );
}
