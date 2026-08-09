import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  className?: string;
}

function Chip({ children, className = "" }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-medium text-[var(--color-muted)] ${className}`}
    >
      {children}
    </span>
  );
}

export default Chip;
