import { CheckCircle2 } from "lucide-react";
import type { ReviewStrength } from "../../../domains/jarvis-review";

interface StrengthsListProps {
  strengths: ReviewStrength[];
}

function StrengthsList({ strengths }: StrengthsListProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
        Strengths
      </h3>

      <ul className="mt-6 space-y-6">
        {strengths.map((s) => (
          <li key={s.id} className="flex items-start gap-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-base font-semibold text-[var(--color-text)]">
                {s.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-body)]">
                {s.explanation}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StrengthsList;
