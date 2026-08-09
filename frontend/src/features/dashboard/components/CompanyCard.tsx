import { Badge, Button, Card } from "../../../components/ui";

interface CompanyCardProps {
  name: string;
  reason: string;
  confidence: string;
}

function CompanyCard({
  name,
  reason,
  confidence,
}: CompanyCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold tracking-tight text-[var(--color-text)]">
          {name}
        </h3>
        <Badge tone="blue">{confidence}</Badge>
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-body)]">
        {reason}
      </p>

      <div className="mt-8 flex items-center justify-between gap-4 pt-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
          Research-ready
        </span>
        <Button variant="secondary" className="px-5 py-1.5 text-xs">
          Investigate
        </Button>
      </div>
    </Card>
  );
}

export default CompanyCard;
