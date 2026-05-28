import { useState } from "react";

import type { SelfLoveEntry } from "@/types/engine";

interface SelfLoveCardProps {
  entry: SelfLoveEntry;
}

export function SelfLoveCard({ entry }: SelfLoveCardProps) {
  const [noteOpen, setNoteOpen] = useState(false);
  const { practice, felt, note, timestamp } = entry;

  const fillPct = (felt / 10) * 100;
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const hasNote = note !== null;

  const content = (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className="font-serif text-[15px] font-semibold leading-snug text-plum">
          {practice}
        </span>
        <span className="font-sans text-[11px] text-muted shrink-0">
          {time}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-1 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-gold"
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <div className="flex justify-between">
          <span className="font-sans text-[10px] text-muted">Adrift</span>
          <span className="font-sans text-[10px] text-muted">Present</span>
        </div>
      </div>
      {hasNote && noteOpen && (
        <p className="font-sans text-[12px] text-muted whitespace-pre-wrap">
          {note}
        </p>
      )}
    </div>
  );

  if (hasNote) {
    return (
      <button
        type="button"
        onClick={() => setNoteOpen((o) => !o)}
        className="w-full text-left bg-canvas rounded-2xl px-4 py-4"
      >
        {content}
      </button>
    );
  }

  return <div className="bg-canvas rounded-2xl px-4 py-4">{content}</div>;
}
