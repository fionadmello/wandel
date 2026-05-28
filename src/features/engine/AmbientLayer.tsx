import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { ReminderCard } from "@/components/ui/ReminderCard";
import { useProfile } from "@/hooks/useProfile";
import { useReminderRotation } from "@/hooks/useReminderRotation";

interface AmbientLayerProps {
  userId: string;
}

export function AmbientLayer({ userId }: AmbientLayerProps) {
  const [expanded, setExpanded] = useState(false);

  const reminder = useReminderRotation(userId);
  const { data: profile } = useProfile(userId);
  const whyStatement = profile?.why_statement ?? "";

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between w-full"
      >
        <span className="font-sans text-[11px] text-muted uppercase tracking-widest">
          Intentions
        </span>
        {expanded ? (
          <ChevronUp size={14} className="text-muted" />
        ) : (
          <ChevronDown size={14} className="text-muted" />
        )}
      </button>

      {expanded && reminder && <ReminderCard text={reminder} />}

      {expanded && whyStatement && (
        <p className="font-serif italic text-[15px] text-violet leading-[1.7]">
          {whyStatement}
        </p>
      )}
    </div>
  );
}
