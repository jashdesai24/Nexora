import { ExternalLink, FileText } from "lucide-react";
import { SectionHeader } from "../../../components/ui";
import type { ResearchSource } from "../../../domains/research-intelligence";

interface SourcesSectionProps {
  sources: ResearchSource[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSourceType(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function SourcesSection({ sources }: SourcesSectionProps) {
  return (
    <section className="space-y-10">
      <SectionHeader
        title="Sources"
        description="Primary sources referenced in this research."
      />

      <ul className="space-y-4">
        {sources.map((source) => (
          <li key={source.id} className="flex items-start gap-3">
            <FileText className="mt-1 h-4 w-4 shrink-0 text-[var(--color-muted)]" />

            <div className="min-w-0 flex-1">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text)] transition-opacity hover:opacity-80"
              >
                {source.title}
                <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
              </a>
              <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                {source.publisher} · {formatSourceType(source.sourceType)} · {formatDate(source.publishedAt)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SourcesSection;
