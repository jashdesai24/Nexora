import { SectionHeader } from "../../../components/ui";

interface NextActionsCardProps {
  questions: string[];
}

function NextActionsCard({ questions }: NextActionsCardProps) {
  return (
    <div className="py-2">
      <SectionHeader
        title="Next Questions"
        description="Open research prompts to resolve before thesis conviction increases."
      />

      <div className="mt-8 space-y-4">
        {questions.map((question) => (
          <label
            key={question}
            className="group flex cursor-pointer items-start gap-4 rounded-xl border border-transparent p-2 transition-colors hover:bg-[var(--color-surface-soft)]"
          >
            <input
              type="checkbox"
              className="mt-1.5 h-5 w-5 shrink-0 cursor-pointer rounded border-[var(--color-border)] bg-transparent accent-[var(--color-text)] transition-colors focus:ring-0 group-hover:border-[var(--color-text)]"
            />
            <span className="text-lg leading-relaxed text-[var(--color-text)] opacity-90 transition-opacity group-hover:opacity-100">
              {question}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default NextActionsCard;
