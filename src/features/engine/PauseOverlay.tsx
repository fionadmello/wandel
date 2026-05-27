interface PauseOverlayProps {
  visible: boolean;
}

export function PauseOverlay({ visible }: PauseOverlayProps) {
  return (
    <div
      aria-hidden={!visible}
      className={`absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none bg-canvas/80 transition-opacity duration-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="font-serif text-[28px] font-semibold text-plum">
        You did great!
      </span>
    </div>
  );
}
