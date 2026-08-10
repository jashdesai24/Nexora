import { useState } from "react";
import { Sunrise, Loader2, RefreshCw } from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader";
import { Button, Card, Divider } from "../../../components/ui";
import { generateDailyBriefing, type DailyBriefing } from "../../../domains/briefing";

function DailyBriefingSection() {
  const [briefings, setBriefings] = useState<DailyBriefing[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateDailyBriefing();
      setBriefings(data);
    } catch (e) {
      setError("Failed to generate your daily briefing.");
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!briefings && !isGenerating && !error) {
    return (
      <section className="space-y-6">
        <SectionHeader
          title="Morning Briefing"
          description="Synthesize overnight research into actionable insights."
        />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface-soft)] to-[var(--color-bg-secondary)] py-12 px-6 text-center shadow-sm">
          <Sunrise className="h-10 w-10 text-[var(--color-text)] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Ready for today's insights?</h3>
          <p className="text-sm text-[var(--color-muted)] max-w-md mb-8">
            Jarvis will analyze recent evidence across your tracked companies and surface what actually matters.
          </p>
          <Button onClick={handleGenerate} className="gap-2 px-6 py-3">
            Generate Morning Briefing
          </Button>
        </div>
      </section>
    );
  }

  if (isGenerating) {
    return (
      <section className="space-y-6">
        <SectionHeader
          title="Morning Briefing"
          description="Synthesizing intelligence..."
        />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-16 px-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-muted)] mb-4" />
          <p className="text-sm font-medium text-[var(--color-text)] animate-pulse">
            Jarvis is evaluating overnight evidence...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <SectionHeader
          title="Morning Briefing"
          description="Synthesize overnight research into actionable insights."
        />
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 py-8 text-center text-red-500">
          <p className="mb-4">{error}</p>
          <Button variant="secondary" onClick={handleGenerate}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Morning Briefing"
          description="Actionable intelligence across your watchlist."
        />
        <Button variant="secondary" onClick={handleGenerate} className="gap-2 px-3 py-1.5 text-xs">
          <RefreshCw className="h-3 w-3" /> Refresh
        </Button>
      </div>

      {briefings?.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-10 text-center text-sm text-[var(--color-muted)]">
          You don't have any tracked companies or there is no recent evidence to brief you on.
        </div>
      ) : (
        <div className="grid gap-6">
          {briefings?.map((b) => (
            <Card key={b.companyId} className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-[var(--color-text)] tracking-tight">
                  {b.companyName}
                </h3>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                      What Changed
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--color-body)]">
                      {b.whatChanged}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                      Why It Matters
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--color-body)]">
                      {b.whyItMatters}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-[var(--color-surface)] p-4 border border-[var(--color-border)]">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-2">
                      Potential Thesis Impact
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--color-text)]">
                      {b.potentialThesisImpact}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                      What Remains Uncertain
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--color-body)]">
                      {b.whatRemainsUncertain}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Divider className="my-10" />
    </section>
  );
}

export default DailyBriefingSection;
