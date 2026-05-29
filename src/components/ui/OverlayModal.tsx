interface OverlayModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export function OverlayModal({ onClose, children }: OverlayModalProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-[400] bg-plum/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[401] flex items-center justify-center px-6 pointer-events-none">
        <div className="relative bg-canvas rounded-3xl w-full max-h-[80dvh] overflow-y-auto pointer-events-auto">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 font-sans text-[16px] text-muted leading-none"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </>
  );
}
