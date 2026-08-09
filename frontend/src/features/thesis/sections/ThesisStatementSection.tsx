import { useEffect, useRef } from "react";

interface ThesisStatementSectionProps {
  value: string;
  onChange: (value: string) => void;
}

function ThesisStatementSection({ value, onChange }: ThesisStatementSectionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <section>
      <p className="mb-6 text-sm font-medium uppercase tracking-widest text-[var(--color-muted)]">
        Why do you believe this company will outperform over your chosen investment horizon?
      </p>
      
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing your core thesis..."
        className="w-full resize-none overflow-hidden bg-transparent text-2xl leading-relaxed text-[var(--color-text)] placeholder-[var(--color-border-strong)] focus:outline-none sm:text-3xl sm:leading-relaxed"
        rows={3}
      />
    </section>
  );
}

export default ThesisStatementSection;
