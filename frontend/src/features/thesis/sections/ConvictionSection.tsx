interface ConvictionSectionProps {
  value: number;
  onChange: (value: number) => void;
}

function getConvictionLabel(val: number) {
  if (val >= 80) return "Very High";
  if (val >= 60) return "High";
  if (val >= 40) return "Medium";
  return "Low";
}

function ConvictionSection({ value, onChange }: ConvictionSectionProps) {
  return (
    <section>
      <h3 className="text-sm font-medium uppercase tracking-widest text-[var(--color-muted)]">
        Conviction Level
      </h3>
      
      <div className="mt-8 flex flex-col items-start gap-8 sm:flex-row sm:items-center">
        <div className="w-full max-w-md">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-surface-soft)] outline-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-text)] [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110"
            style={{
              background: `linear-gradient(to right, var(--color-text) ${value}%, var(--color-surface-soft) ${value}%)`,
            }}
          />
          <div className="mt-3 flex w-full justify-between px-1 text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
            <span>0</span>
            <span>100</span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold tracking-tight text-[var(--color-text)]">
            {value}%
          </span>
          <span className="text-sm font-medium uppercase tracking-widest text-[var(--color-muted)]">
            {getConvictionLabel(value)}
          </span>
        </div>
      </div>
    </section>
  );
}

export default ConvictionSection;
