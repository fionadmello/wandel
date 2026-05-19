export interface HabitResponse {
  habitId: string;
  whatDone: string;
  whatGotInWay: string;
  adjustment: string;
}

export interface ReviewFormState {
  engineResponse: string;
  prideNote: string;
  habitResponses: Record<string, HabitResponse>;
  selfRatedConsistency: number | null;
}

export interface SubmitWeeklyReviewPayload {
  weekEnding: string;
  engineResponse: string;
  prideNote: string | null;
  selfRatedConsistency: number;
  habitResponses: HabitResponse[];
}

export interface WeeklyConsistencyData {
  engineMarked: number;
  breakObsDaysByHabit: Record<string, number>;
  buildObsDaysByHabit: Record<string, number>;
}
