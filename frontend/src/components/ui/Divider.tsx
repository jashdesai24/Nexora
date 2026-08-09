interface DividerProps {
  className?: string;
}

function Divider({ className = "" }: DividerProps) {
  return (
    <div
      className={`h-px w-full bg-[var(--color-border)] ${className}`}
      role="separator"
    />
  );
}

export default Divider;
