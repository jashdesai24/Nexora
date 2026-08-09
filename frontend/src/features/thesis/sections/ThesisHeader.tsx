import { Badge } from "../../../components/ui";
import type { ThesisStatus } from "../../../domains/investment-thesis";
import { cn } from "../../../utils/cn";

interface ThesisHeaderProps {
  companyName: string;
  status: ThesisStatus;
  updatedAt: string;
  conviction: number;
}

const statusColor = {
  Draft: "amber",
  Active: "green",
  Invalidated: "red",
  Completed: "blue",
} as const;

function ThesisHeader({
  companyName,
  status,
  updatedAt,
  conviction,
}: ThesisHeaderProps) {
  const dateStr = new Date(updatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="flex flex-col items-start gap-8">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge tone={statusColor[status]}>{status}</Badge>
          <span className="text-sm font-medium text-[var(--color-muted)]">
            Last updated {dateStr}
          </span>
        </div>
        
        <div className="flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-1.5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            Conviction
          </span>
          <span className={cn("font-bold", conviction > 75 ? "text-emerald-400" : conviction > 40 ? "text-amber-400" : "text-rose-400")}>
            {conviction}%
          </span>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
          Investment Thesis
        </p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-[var(--color-text)] sm:text-6xl">
          {companyName}
        </h1>
      </div>
    </header>
  );
}

export default ThesisHeader;
