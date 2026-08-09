import { Badge, SectionHeader } from "../../../components/ui";
import type { ThesisImpactEntry, ResearchEvidence } from "../../../domains/research-intelligence";

interface ThesisImpactSectionProps {
  impacts: ThesisImpactEntry[];
  evidence: ResearchEvidence[];
}

const impactTone = {
  supports: "green",
  weakens: "red",
  neutral: "neutral",
  uncertain: "amber",
} as const;

function formatImpact(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function ThesisImpactSection({ impacts, evidence }: ThesisImpactSectionProps) {
  const evidenceById = new Map(evidence.map((e) => [e.id, e]));

  return (
    <section className="space-y-10">
      <SectionHeader
        title="Thesis Impact"
        description="How recent evidence relates to your investment thesis."
      />

      <ul className="space-y-6">
        {impacts.map((entry) => {
          const ev = evidenceById.get(entry.evidenceId);
          if (!ev) return null;

          return (
            <li key={entry.evidenceId} className="flex items-start gap-4">
              <Badge tone={impactTone[entry.impact]} className="mt-0.5 shrink-0">
                {formatImpact(entry.impact)}
              </Badge>

              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {ev.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                  {entry.rationale}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default ThesisImpactSection;
