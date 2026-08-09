interface OverallAssessmentProps {
  assessment: string;
  reviewedAt: string;
}

function OverallAssessment({ assessment, reviewedAt }: OverallAssessmentProps) {
  const dateStr = new Date(reviewedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
          Overall Assessment
        </h3>
        <span className="text-xs text-[var(--color-muted)]">
          Reviewed {dateStr}
        </span>
      </div>

      <p className="mt-6 text-lg leading-relaxed text-[var(--color-body)]">
        {assessment}
      </p>
    </div>
  );
}

export default OverallAssessment;
