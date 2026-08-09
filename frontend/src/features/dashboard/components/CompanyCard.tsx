import { Badge, Button, Card } from "../../../components/ui";
import { Link } from "react-router-dom";

interface CompanyCardProps {
  id: string;
  name: string;
  sector?: string;
  industry?: string;
}

function CompanyCard({
  id,
  name,
  sector,
  industry,
}: CompanyCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold tracking-tight text-[var(--color-text)]">
          {name}
        </h3>
        {sector && <Badge tone="blue">{sector}</Badge>}
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-body)]">
        {industry || "No industry information provided."}
      </p>

      <div className="mt-8 flex items-center justify-between gap-4 pt-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
          Research-ready
        </span>
        <Link to={`/research/${id}`}>
          <Button variant="secondary" className="px-5 py-1.5 text-xs">
            Investigate
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default CompanyCard;
