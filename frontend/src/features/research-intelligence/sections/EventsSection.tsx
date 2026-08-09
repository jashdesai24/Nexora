import { Calendar } from "lucide-react";
import { Badge, SectionHeader } from "../../../components/ui";
import type { ResearchEvent } from "../../../domains/research-intelligence";

interface EventsSectionProps {
  events: ResearchEvent[];
}

const eventTypeTone = {
  earnings: "blue",
  filing: "neutral",
  "management-change": "amber",
  "corporate-action": "amber",
  regulatory: "red",
  macro: "neutral",
} as const;

function formatEventType(value: string) {
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

function EventsSection({ events }: EventsSectionProps) {
  return (
    <section className="space-y-10">
      <SectionHeader
        title="Recent Events"
        description="Significant developments affecting the company."
      />

      <ul className="space-y-6">
        {events.map((event) => (
          <li key={event.id} className="flex items-start gap-4">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
              <Calendar className="h-4 w-4 text-[var(--color-muted)]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-base font-medium text-[var(--color-text)]">
                  {event.title}
                </h3>
                <div className="flex items-center gap-3">
                  <Badge tone={eventTypeTone[event.eventType]}>
                    {formatEventType(event.eventType)}
                  </Badge>
                  <span className="text-xs text-[var(--color-muted)]">
                    {formatDate(event.occurredAt)}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                {event.description}
              </p>
              <p className="mt-1.5 text-xs text-[var(--color-muted)] opacity-60">
                Source: {event.source.publisher}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default EventsSection;
