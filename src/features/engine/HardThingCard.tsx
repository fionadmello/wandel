import { useState } from "react";

import { computeInsight } from "@/constants/insightLine";
import { BdaDot } from "@/features/engine/BdaDot";
import type { HardThing } from "@/types/engine";

interface HardThingCardProps {
  entry: HardThing;
}

export function HardThingCard({ entry }: HardThingCardProps) {
  const [noteOpen, setNoteOpen] = useState(false);
  const { what, before, during, after, note } = entry;
  const insight = computeInsight(before, during, after);
  const hasNote = note !== null;

  return (
    <button
      type="button"
      onClick={() => hasNote && setNoteOpen((o) => !o)}
      className="w-full text-left bg-canvas rounded-2xl px-4 py-4 flex flex-col gap-3"
    >
      <span className="font-serif text-[15px] font-semibold leading-snug text-plum">
        {what}
      </span>
      <div className="flex items-end gap-5">
        <BdaDot value={before} label="Before" />
        <BdaDot value={during} label="During" />
        <BdaDot value={after} label="After" />
      </div>
      <span className="font-sans text-[11px] italic text-muted">{insight}</span>
      {hasNote && noteOpen && (
        <p
          data-testid="hard-thing-note"
          className="font-sans text-[12px] text-muted whitespace-pre-wrap"
        >
          {note}
        </p>
      )}
    </button>
  );
}
