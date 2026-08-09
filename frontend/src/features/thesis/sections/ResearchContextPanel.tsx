import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../../components/ui";
import type { InvestmentIntelligence } from "../../../domains/investment-intelligence";

interface ResearchContextPanelProps {
  intelligence: InvestmentIntelligence;
}

function ResearchContextPanel({ intelligence }: ResearchContextPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-6 py-5">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            Research Context
          </h3>
          <Badge tone="blue">{intelligence.confidence}% confidence</Badge>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-[var(--color-muted)]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--color-muted)]" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Why Today */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
              Why Today
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
              {intelligence.whyToday}
            </p>
          </div>

          {/* Key Evidence */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
              Key Evidence
            </p>
            <ul className="mt-2 space-y-1.5">
              {intelligence.evidence.slice(0, 4).map((e) => (
                <li
                  key={e.id}
                  className="flex items-start gap-2 text-sm text-[var(--color-body)]"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-muted)]" />
                  {e.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Key Risks */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
              Key Risks
            </p>
            <ul className="mt-2 space-y-1.5">
              {intelligence.risks.slice(0, 3).map((r) => (
                <li
                  key={r.id}
                  className="flex items-start gap-2 text-sm text-[var(--color-body)]"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-muted)]" />
                  {r.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Catalysts */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
              Catalysts
            </p>
            <ul className="mt-2 space-y-1.5">
              {intelligence.catalysts.slice(0, 3).map((c) => (
                <li
                  key={c.id}
                  className="flex items-start gap-2 text-sm text-[var(--color-body)]"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-muted)]" />
                  {c.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

export default ResearchContextPanel;
