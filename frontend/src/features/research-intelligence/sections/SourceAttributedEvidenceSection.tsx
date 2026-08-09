import { ExternalLink } from "lucide-react";
import { Badge, SectionHeader, Timeline } from "../../../components/ui";
import type { ResearchEvidence } from "../../../domains/research-intelligence";

interface SourceAttributedEvidenceSectionProps {
  evidence: ResearchEvidence[];
}

const impactTone = {
  positive: "green",
  negative: "red",
  mixed: "amber",
} as const;

function formatCategory(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SourceAttributedEvidenceSection({ evidence }: SourceAttributedEvidenceSectionProps) {
  const timelineItems = evidence.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.summary,
    meta: (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
            {formatCategory(item.category)}
          </span>
          <Badge tone={impactTone[item.impact]}>{formatCategory(item.impact)}</Badge>
        </div>
        <a
          href={item.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)] opacity-70 transition-opacity hover:opacity-100"
          title={item.source.title}
        >
          {item.source.publisher} · {formatDate(item.publishedAt)}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    ),
  }));

  return (
    <section className="space-y-10">
      <SectionHeader
        title="Research Evidence"
        description="Source-attributed findings from filings, earnings, and public disclosures."
      />

      <div className="pl-2">
        <Timeline items={timelineItems} />
      </div>
    </section>
  );
}

export default SourceAttributedEvidenceSection;
