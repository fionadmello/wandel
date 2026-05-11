import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

import { EngineDriftModal } from "@/features/protocols/EngineDriftModal";
import { EngineSlipModal } from "@/features/protocols/EngineSlipModal";
import { HabitDriftModal } from "@/features/protocols/HabitDriftModal";
import {
  useClearPendingProtocol,
  usePendingProtocol,
  useSetPendingProtocol,
} from "@/hooks/usePendingProtocol";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useProtocolDetection } from "@/hooks/useProtocolDetection";
import { useSession } from "@/hooks/useSession";
import type { Profile } from "@/types/database";
import type { PendingProtocol } from "@/types/protocols";

interface InnerProps {
  userId: string;
  profile: Profile;
}

function OrchestratorInner({ userId, profile }: InnerProps) {
  const { protocol, isChecking } = useProtocolDetection(userId, profile);
  const { data: existingPending } = usePendingProtocol(userId);

  const [activeProtocol, setActiveProtocol] = useState<PendingProtocol | null>(
    null,
  );
  const didAct = useRef(false);

  const { mutate: setPending } = useSetPendingProtocol(userId);
  const { mutate: clearPending } = useClearPendingProtocol(userId);
  const { mutate: updateProfile } = useUpdateProfile(userId);

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (!protocol || isChecking || didAct.current) return;
    didAct.current = true;

    setActiveProtocol(protocol);

    if (profile.last_protocol_check !== today) {
      updateProfile({ last_protocol_check: today });
    }

    if (!existingPending) {
      setPending(protocol);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [protocol, isChecking]);

  const handleDismiss = () => setActiveProtocol(null);

  const handleComplete = () => {
    setActiveProtocol(null);
    clearPending();
  };

  if (!activeProtocol) return null;

  if (activeProtocol.id === "engine_slip") {
    return (
      <EngineSlipModal
        protocol={activeProtocol}
        userId={userId}
        onDismiss={handleDismiss}
        onComplete={handleComplete}
      />
    );
  }

  if (activeProtocol.id === "engine_drift") {
    return (
      <EngineDriftModal
        protocol={activeProtocol}
        userId={userId}
        onDismiss={handleDismiss}
        onComplete={handleComplete}
      />
    );
  }

  if (activeProtocol.id === "habit_drift") {
    return (
      <HabitDriftModal
        protocol={activeProtocol}
        userId={userId}
        onDismiss={handleDismiss}
        onComplete={handleComplete}
      />
    );
  }

  return null;
}

export function ProtocolOrchestrator() {
  const { session } = useSession();
  const userId = session?.user.id ?? "";
  const { data: profile } = useProfile(userId);

  if (!userId || !profile) return null;

  return <OrchestratorInner userId={userId} profile={profile} />;
}
