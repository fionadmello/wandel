import { useEffect, useState } from "react";

interface ProtocolModalProps {
  children: React.ReactNode;
}

export function ProtocolModal({ children }: ProtocolModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-[300] bg-plum/35" aria-hidden="true" />

      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[301] bg-canvas rounded-t-[22px] max-h-[90dvh] overflow-y-auto transition-protocol-sheet ${visible ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-border" />
        </div>

        {children}
      </div>
    </>
  );
}
