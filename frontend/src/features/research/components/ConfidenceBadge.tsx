interface ConfidenceBadgeProps {
  value: number;
  label?: string;
}

function ConfidenceBadge({
  value,
  label = "Confidence",
}: ConfidenceBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-100">
      <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(121,211,187,0.45)]" />
      <span>{label}</span>
      <span className="text-[var(--color-text)]">{value}%</span>
    </div>
  );
}

export default ConfidenceBadge;
