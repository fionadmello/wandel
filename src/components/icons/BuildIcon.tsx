interface BuildIconProps {
  active: boolean;
}

export function BuildIcon({ active }: BuildIconProps) {
  const stroke = active ? "var(--color-plum)" : "var(--color-muted)";
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="22" x2="12" y2="11" />
      <path d="M12 11c0-4 3.5-7 7-7-2.5 4-4.5 7-7 7" />
      <path d="M12 11c0-4-3.5-7-7-7 2.5 4 4.5 7 7 7" />
      <path d="M9 20s1 .5 3 .5 3-.5 3-.5" />
    </svg>
  );
}
