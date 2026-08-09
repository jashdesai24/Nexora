import { AlertTriangle, ArrowUpRight } from "lucide-react";
import type { ReviewGap, ThesisSectionTarget } from "../../../domains/jarvis-review";

interface GapsListProps {
  gaps: ReviewGap[];
  onAddressGap?: (targetSection: ThesisSectionTarget) => void;
}

function GapsList({ gaps, onAddressGap }: GapsListProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
        Gaps in Reasoning
      </h3>

      <ul className="mt-6 space-y-8">
        {gaps.map((g) => (
          <li
            key={g.id}
            className="border-l-2 border-amber-400/40 pl-5"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-base font-semibold text-[var(--color-text)]">
                {g.title}
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
              {g.explanation}
            </p>
            <p className="mt-3 text-sm leading-relaxed italic text-[var(--color-muted)]">
              Suggestion: {g.suggestion}
            </p>

            {onAddressGap && (
              <button
                type="button"
                onClick={() => onAddressGap(g.targetSection)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text)] opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
              >
                Address this
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GapsList;
