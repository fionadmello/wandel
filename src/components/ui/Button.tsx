import { BUTTON_VARIANT_CLASSES } from "@/constants/buttonVariants";

interface ButtonProps {
  variant?: keyof typeof BUTTON_VARIANT_CLASSES;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  variant = "primary",
  children,
  onClick,
  disabled,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full block text-center leading-tight transition-opacity border-none ${disabled ? "opacity-50 cursor-default" : "opacity-100 cursor-pointer"} ${BUTTON_VARIANT_CLASSES[variant]}`}
    >
      {children}
    </button>
  );
}
