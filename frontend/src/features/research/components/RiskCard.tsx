import { Badge } from "../../../components/ui";
import type { Risk } from "../../../domains/investment-intelligence";

interface RiskCardProps {
  risk: Risk;
}

const severityClassName = {
  low: "green",
  medium: "amber",
  high: "red",
} as const;

function formatLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function RiskCard({ risk }: RiskCardProps) {
  return (
    <div className="group relative flex flex-col items-start gap-3 py-2 pl-4">
      {/* Decorative vertical line indicating risk */}
      <div className="absolute left-0 top-2 h-full w-[2px] bg-[var(--color-border)] transition-colors group-hover:bg-[var(--color-accent)]" />
      
      <div className="flex w-full items-center justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight text-[var(--color-text)]">
          {risk.title}
        </h3>
        <Badge tone={severityClassName[risk.severity]}>
          {formatLabel(risk.severity)}
        </Badge>
      </div>

      <p className="text-base leading-relaxed text-[var(--color-body)]">
        {risk.explanation}
      </p>
    </div>
  );
}

export default RiskCard;
