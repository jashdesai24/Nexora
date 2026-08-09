interface ProgressBarProps {
  value: number;
  label?: string;
}

function ProgressBar({ value, label }: ProgressBarProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center justify-between text-sm text-[var(--color-muted)]">
          <span>{label}</span>
          <span>{normalizedValue}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-soft)]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)]"
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
