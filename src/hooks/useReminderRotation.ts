import { differenceInDays, format, parseISO } from "date-fns";
import { useEffect } from "react";

import {
  useProfile,
  useProfileReminders,
  useUpdateProfile,
} from "./useProfile";

export function useReminderRotation(userId: string): string | null {
  const profileQuery = useProfile(userId);
  const remindersQuery = useProfileReminders(userId);
  const { mutate: updateProfile } = useUpdateProfile(userId);

  const profile = profileQuery.data;
  const reminders = remindersQuery.data;

  useEffect(() => {
    if (!profile || !reminders || reminders.length === 0) return;

    const today = format(new Date(), "yyyy-MM-dd");
    const lastRotated = profile.reminder_last_rotated;

    if (lastRotated === today) return;

    const shouldRotate =
      !lastRotated ||
      differenceInDays(parseISO(today), parseISO(lastRotated)) >= 3;

    if (!shouldRotate) return;

    const nextIndex = (profile.reminder_index + 1) % reminders.length;
    updateProfile({ reminder_index: nextIndex, reminder_last_rotated: today });
  }, [profile, reminders, updateProfile]);

  if (!profile || !reminders || reminders.length === 0) return null;

  return reminders[profile.reminder_index % reminders.length]?.value ?? null;
}
