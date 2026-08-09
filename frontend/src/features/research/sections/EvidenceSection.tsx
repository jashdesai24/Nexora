import { SectionHeader, Timeline } from "../../../components/ui";
import { Badge } from "../../../components/ui";
import type { Evidence } from "../../../domains/investment-intelligence";

interface EvidenceSectionProps {
  evidence: Evidence[];
}

const impactClassName = {
  positive: "green",
  negative: "red",
  mixed: "amber",
} as const;

function formatLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function EvidenceSection({ evidence }: EvidenceSectionProps) {
  const timelineItems = evidence.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.explanation,
    meta: (
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
          {formatLabel(item.category)}
        </span>
        <Badge tone={impactClassName[item.impact]}>{formatLabel(item.impact)}</Badge>
      </div>
    ),
  }));

  return (
    <section className="space-y-10">
      <SectionHeader
        title="Evidence"
        description="Signals that explain what is changing and why it matters."
      />

      <div className="pl-2">
        <Timeline items={timelineItems} />
      </div>
    </section>
  );
}

export default EvidenceSection;
