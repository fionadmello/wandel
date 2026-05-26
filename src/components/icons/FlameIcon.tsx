interface FlameIconProps {
  active: boolean;
}

export function FlameIcon({ active }: FlameIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {active && (
        <defs>
          <linearGradient
            id="flame-gradient"
            x1="12"
            y1="21"
            x2="12"
            y2="2"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#6b5878" />
            <stop offset="100%" stopColor="#a05e30" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 21C7.5 21 4 17.5 4 13C4 9 6.5 6.5 9 4.5C9 7.5 10.5 9 12 9C13 6 14 3 12 2C16 3.5 20 7.5 20 13C20 17.5 16.5 21 12 21Z"
        stroke={active ? "url(#flame-gradient)" : "var(--color-muted)"}
      />
    </svg>
  );
}
