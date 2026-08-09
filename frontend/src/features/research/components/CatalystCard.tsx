import { Badge, Card } from "../../../components/ui";
import type { Catalyst } from "../../../domains/investment-intelligence";

interface CatalystCardProps {
  catalyst: Catalyst;
}

const importanceClassName = {
  low: "neutral",
  medium: "blue",
  high: "amber",
} as const;

function formatLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function CatalystCard({ catalyst }: CatalystCardProps) {
  return (
    <Card className="h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            {catalyst.title}
          </h3>

          {catalyst.expectedDate && (
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Expected: {catalyst.expectedDate}
            </p>
          )}
        </div>

        <Badge tone={importanceClassName[catalyst.importance]}>
          {formatLabel(catalyst.importance)} importance
        </Badge>
      </div>
    </Card>
  );
}

export default CatalystCard;
