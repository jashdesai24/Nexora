import Badge from "./Badge";
import Card from "./Card";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  tone?: "green" | "red" | "amber" | "blue" | "neutral";
}

function StatCard({
  title,
  value,
  change,
  tone = "neutral",
}: StatCardProps) {
  return (
    <Card padding="md" className="flex flex-col justify-between">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">{title}</p>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
          {value}
        </p>
        {change && (
          <Badge tone={tone} className="px-2 py-0.5 text-[11px]">
            {change}
          </Badge>
        )}
      </div>
    </Card>
  );
}

export default StatCard;
