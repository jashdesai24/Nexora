import { ProgressBar } from "../../../components/ui";

interface ConfidenceCardProps {
  confidence: number;
  summary: string;
}

function ConfidenceCard({
  confidence,
  summary,
}: ConfidenceCardProps) {
  return (
    <div className="py-2">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Conviction Meter
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text)]">
            {summary}
          </h2>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-4xl font-bold tracking-tighter text-[var(--color-text)]">
            {confidence}%
          </span>
          <span className="text-sm font-medium uppercase tracking-widest text-[var(--color-muted)]">
            Confidence
          </span>
        </div>
      </div>

      <div className="mt-8 w-full">
        <ProgressBar value={confidence} />
      </div>
    </div>
  );
}

export default ConfidenceCard;
