import { Card, SectionHeader } from "../../../components/ui";

function ThesisCard() {
  return (
    <Card>
      <SectionHeader
        eyebrow="Working Thesis"
        title="Thesis not formed yet"
      />

      <p className="mt-4 leading-7 text-[var(--color-body)]">
        Use this space to turn gathered evidence into a clear, testable view.
        The workspace should support reasoning before conviction.
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] p-4">
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          Draft thesis area reserved for future research notes, evidence links,
          and conviction history.
        </p>
      </div>
    </Card>
  );
}

export default ThesisCard;
