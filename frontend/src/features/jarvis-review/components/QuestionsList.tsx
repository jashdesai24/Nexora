import { HelpCircle } from "lucide-react";
import type { ReviewQuestion } from "../../../domains/jarvis-review";

interface QuestionsListProps {
  questions: ReviewQuestion[];
}

function QuestionsList({ questions }: QuestionsListProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
        Questions to Investigate
      </h3>

      <ol className="mt-6 space-y-6">
        {questions.map((q, index) => (
          <li key={q.id} className="flex items-start gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-xs font-bold text-[var(--color-muted)]">
              {index + 1}
            </span>
            <div>
              <div className="flex items-start gap-2">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-muted)]" />
                <p className="text-base font-semibold text-[var(--color-text)]">
                  {q.question}
                </p>
              </div>
              <p className="mt-1.5 pl-6 text-sm leading-relaxed text-[var(--color-body)]">
                {q.rationale}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default QuestionsList;
