import ConfidenceBadge from "./ConfidenceBadge";

interface WorkspaceHeaderProps {
  companyName: string;
  attentionReason: string;
  confidence: number;
}

function WorkspaceHeader({
  companyName,
  attentionReason,
  confidence,
}: WorkspaceHeaderProps) {
  return (
    <header className="flex flex-col items-start gap-6">
      <div className="flex w-full items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
          Research Report
        </p>
        <ConfidenceBadge value={confidence} />
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
