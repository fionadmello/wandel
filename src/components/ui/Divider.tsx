interface DividerProps {
  className?: string;
}

export function Divider({ className = "my-4" }: DividerProps) {
  return <hr className={`h-[0.5px] bg-soft border-none ${className}`} />;
}
