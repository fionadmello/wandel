// This file is a stub and will be replaced in a later task.
// Do not add implementation here.

import type { HabitWithConfigs } from "@/types/database";

interface ReviewFlowProps {
  userId: string;
  breakHabits: HabitWithConfigs[];
  buildHabits: HabitWithConfigs[];
  onComplete: () => void;
  onCancel: () => void;
}

export function ReviewFlow(props: ReviewFlowProps): null {
  void props;
  return null;
}
