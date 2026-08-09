import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";

interface WorkspaceHeaderProps {
  companyName: string;
  attentionReason: string;
  confidence: number;
  isTracked?: boolean;
  onTrackToggle?: () => void;
}

function WorkspaceHeader({
  companyName,
  attentionReason,
  confidence,
  isTracked,
  onTrackToggle,
}: WorkspaceHeaderProps) {
  return (
    <header className="flex flex-col items-start gap-6">
      <div className="flex w-full items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
          Research Report
        </p>
        <div className="flex items-center gap-4">
          {onTrackToggle && (
            <button
              onClick={onTrackToggle}
              className="group flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1.5 text-sm font-medium transition-colors hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
            >
              {isTracked ? (
                <>
                  <BookmarkCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-500">Tracked</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="h-4 w-4 text-[var(--color-muted)] group-hover:text-[var(--color-text)]" />
                  <span className="text-[var(--color-muted)] group-hover:text-[var(--color-text)]">Track</span>
                </>
              )}
            </button>
          )}
          <ConfidenceBadge value={confidence} />
        </div>
      </div>

      <div>
        <h1 className="text-5xl font-bold tracking-tight text-[var(--color-text)] sm:text-6xl lg:text-7xl">
          {companyName}
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[var(--color-body)] sm:text-2xl sm:leading-relaxed">
          {attentionReason}
        </p>
      </div>
    </header>
  );
}

export default WorkspaceHeader;
