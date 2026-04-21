interface ScreenWrapProps {
  children: React.ReactNode;
}

export function ScreenWrap({ children }: ScreenWrapProps) {
  return <div>{children}</div>;
}
