import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "blue" | "green" | "amber" | "red";
  className?: string;
}

const toneClassName = {
  neutral:
    "border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-muted)]",
  blue: "border-blue-400/20 bg-blue-400/10 text-blue-200",
  green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  red: "border-red-400/20 bg-red-400/10 text-red-200",
};

function Badge({
  children,
  tone = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium ${toneClassName[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
