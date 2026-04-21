interface ButtonProps {
  variant?: "primary" | "accent" | "ghost";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export function Button({
  variant = "primary",
  children,
  onClick,
  disabled,
  type = "button",
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
    >
      {children}
    </button>
  );
}
