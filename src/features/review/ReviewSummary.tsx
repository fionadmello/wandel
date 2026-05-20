// This file is a stub and will be replaced in a later task.
// Do not add implementation here.

import type { HabitWithConfigs } from "@/types/database";

interface ReviewSummaryProps {
  userId: string;
  breakHabits: HabitWithConfigs[];
  buildHabits: HabitWithConfigs[];
  onStartReview: () => void;
}

export function ReviewSummary(props: ReviewSummaryProps): null {
  void props;
  return null;
}
