import { ArrowLeft } from "lucide-react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { useUpdateHabitJobs } from "@/hooks/useUpdateHabitJobs";
import type { HabitConfig } from "@/types/database";
import type { JobOption } from "@/types/setup";

import { JobsConfig } from "./JobsConfig";

interface JobConfigPanelProps {
  userId: string;
  habitId: string;
  habitName: string;
  currentConfigs: HabitConfig[];
  onClose: () => void;
}

export function JobConfigPanel({
  userId,
  habitId,
  habitName,
  currentConfigs,
  onClose,
}: JobConfigPanelProps) {
  const { mutate: updateJobs, isPending } = useUpdateHabitJobs(userId);

  const currentJobs: JobOption[] = (currentConfigs ?? [])
    .filter((c) => c.key === "job")
    .map((c) => ({ name: c.value, description: c.sub_type ?? "" }));

  return (
    <ScreenWrap padBottom={false}>
      <div className="flex items-center gap-3 px-5 pt-[14px]">
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-muted bg-transparent border-none cursor-pointer shrink-0"
          aria-label="Close"
        >
          <ArrowLeft size={18} />
        </button>
        <p className="font-sans text-sm font-medium text-plum">
          {habitName} — jobs
        </p>
      </div>

      <JobsConfig
        values={currentJobs}
        habitName={habitName}
        submitLabel={isPending ? "Saving…" : "Save"}
        onNext={(jobs) => {
          updateJobs({ habitId, jobs }, { onSuccess: onClose });
        }}
      />
    </ScreenWrap>
  );
}
