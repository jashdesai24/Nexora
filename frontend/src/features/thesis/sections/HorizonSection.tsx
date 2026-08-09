import type { TimeHorizon } from "../../../domains/investment-thesis";
import { cn } from "../../../utils/cn";

interface HorizonSectionProps {
  value: TimeHorizon;
  onChange: (value: TimeHorizon) => void;
}

const HORIZONS: TimeHorizon[] = ["Short-term", "Medium-term", "Long-term"];

function HorizonSection({ value, onChange }: HorizonSectionProps) {
  return (
    <section>
      <h3 className="text-sm font-medium uppercase tracking-widest text-[var(--color-muted)]">
        Investment Horizon
      </h3>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {HORIZONS.map((horizon) => {
          const isActive = value === horizon;
          return (
            <button
              key={horizon}
              type="button"
              onClick={() => onChange(horizon)}
              className={cn(
                "rounded-full border px-6 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]",
                isActive
                  ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]"
                  : "border-[var(--color-border)] bg-transparent text-[var(--color-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
              )}
            >
              {horizon}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default HorizonSection;
