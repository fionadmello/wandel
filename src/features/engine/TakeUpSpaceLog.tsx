import { TakeUpSpaceEntryCard } from "@/features/engine/TakeUpSpaceEntryCard";
import type { TakeUpSpaceEntry } from "@/types/takeUpSpace";

interface TakeUpSpaceLogProps {
  entries: TakeUpSpaceEntry[];
  onContinueDraft: () => void;
  onAddToCost: (entry: TakeUpSpaceEntry) => void;
}

export function TakeUpSpaceLog({
  entries,
  onContinueDraft,
  onAddToCost,
}: TakeUpSpaceLogProps) {
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => (
        <TakeUpSpaceEntryCard
          key={entry.id}
          entry={entry}
          onContinue={onContinueDraft}
          onAddToCost={() => onAddToCost(entry)}
        />
      ))}
    </div>
  );
}
