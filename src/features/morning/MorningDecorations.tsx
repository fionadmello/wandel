export function MorningDecorations() {
  return (
    <>
      <span className="absolute bottom-[-20px] left-[-10px] font-serif italic text-[280px] text-plum opacity-[0.04] leading-none select-none pointer-events-none">
        W
      </span>
      <svg
        width="320"
        height="320"
        viewBox="0 0 320 320"
        className="absolute bottom-0 right-0 opacity-[0.07] pointer-events-none"
        aria-hidden="true"
      >
        {[60, 120, 180, 240, 300].map((r) => (
          <circle
            key={r}
            cx="320"
            cy="320"
            r={r}
            fill="none"
            stroke="var(--color-plum)"
            strokeWidth="1"
          />
        ))}
      </svg>
    </>
  );
}
