import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-body)] shadow-xl group-hover:block">
        {content}
      </span>
    </span>
  );
}

export default Tooltip;
