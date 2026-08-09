interface SectionHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
}

function SectionHeader({
  title,
  description,
  eyebrow,
}: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
          {eyebrow}
        </p>
      )}

      <h2 className="text-2xl font-semibold leading-tight tracking-[-0.01em] text-[var(--color-text)]">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
