import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SectionHeader } from "../../../components/ui";
import type { KeyChange } from "../../../domains/research-intelligence";

interface KeyChangesSectionProps {
  keyChanges: KeyChange[];
}

const directionConfig = {
  improving: {
    icon: TrendingUp,
    color: "text-emerald-400",
    borderColor: "border-emerald-400/30",
  },
  deteriorating: {
    icon: TrendingDown,
    color: "text-red-400",
    borderColor: "border-red-400/30",
  },
  stable: {
    icon: Minus,
    color: "text-[var(--color-muted)]",
    borderColor: "border-[var(--color-border)]",
  },
} as const;

function KeyChangesSection({ keyChanges }: KeyChangesSectionProps) {
  return (
    <section className="space-y-10">
      <SectionHeader
        title="Key Changes"
        description="Material shifts in the company's trajectory since the last assessment."
      />

      <ul className="space-y-6">
        {keyChanges.map((change) => {
          const config = directionConfig[change.direction];
          const Icon = config.icon;

          return (
            <li
              key={change.id}
              className={`border-l-2 ${config.borderColor} pl-5`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.color}`} />
                <div>
                  <p className="text-base font-medium text-[var(--color-text)]">
                    {change.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                    {change.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default KeyChangesSection;
