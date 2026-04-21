interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

export function Label({ children, htmlFor }: LabelProps) {
  return <label htmlFor={htmlFor}>{children}</label>;
}
