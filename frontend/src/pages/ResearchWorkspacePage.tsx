import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import {
  getInvestmentIntelligence,
  type InvestmentIntelligence,
} from "../domains/investment-intelligence";
import {
  getResearchIntelligence,
  type ResearchIntelligence,
} from "../domains/research-intelligence";
import Skeleton from "../components/ui/Skeleton";
import WorkspaceHeader from "../features/research/components/WorkspaceHeader";
import CatalystsSection from "../features/research/sections/CatalystsSection";
import ConfidenceSection from "../features/research/sections/ConfidenceSection";
import EvidenceSection from "../features/research/sections/EvidenceSection";
import NextActionsSection from "../features/research/sections/NextActionsSection";
import RisksSection from "../features/research/sections/RisksSection";
import WhyTodaySection from "../features/research/sections/WhyTodaySection";
import SourceAttributedEvidenceSection from "../features/research-intelligence/sections/SourceAttributedEvidenceSection";
import EventsSection from "../features/research-intelligence/sections/EventsSection";
import KeyChangesSection from "../features/research-intelligence/sections/KeyChangesSection";
import ThesisImpactSection from "../features/research-intelligence/sections/ThesisImpactSection";
import SourcesSection from "../features/research-intelligence/sections/SourcesSection";
import { Button, Divider } from "../components/ui";

function ResearchWorkspacePage() {
  const { companyId = "hdfc-bank" } = useParams();
  const navigate = useNavigate();
  const [intelligence, setIntelligence] =
    useState<InvestmentIntelligence | null>(null);
  const [researchIntelligence, setResearchIntelligence] =
    useState<ResearchIntelligence | null>(null);
  const [researchLoading, setResearchLoading] = useState(true);
  const [researchError, setResearchError] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      setResearchLoading(true);
      setResearchError(false);

      try {
        const [analysisResult, researchResult] = await Promise.all([
          getInvestmentIntelligence(companyId),
          getResearchIntelligence(companyId),
        ]);

        if (isCurrent) {
          setIntelligence(analysisResult);
          setResearchIntelligence(researchResult);
        }
      } catch {
        if (isCurrent) {
          setResearchError(true);
        }
      } finally {
        if (isCurrent) {
          setResearchLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isCurrent = false;
    };
  }, [companyId]);


  if (!intelligence) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-48 w-full" />
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16"
    >
      <WorkspaceHeader
        companyName={intelligence.companyName}
        confidence={intelligence.confidence}
        attentionReason={intelligence.whyToday}
      />

      <div className="mt-16 space-y-16">
        {/* --- Jarvis Analysis --- */}
        <WhyTodaySection whyToday={intelligence.whyToday} />
        
        <Divider className="opacity-50" />
        
        <EvidenceSection evidence={intelligence.evidence} />
        
        <Divider className="opacity-50" />
        
        <ConfidenceSection
          confidence={intelligence.confidence}
          summary={intelligence.summary}
        />
        
        <Divider className="opacity-50" />
        
        <RisksSection risks={intelligence.risks} />
        
        <Divider className="opacity-50" />
        
        <CatalystsSection catalysts={intelligence.catalysts} />
        
        <Divider className="opacity-50" />
        
        <NextActionsSection questions={intelligence.nextQuestions} />

        {/* --- Source-Attributed Research Intelligence --- */}
        {researchLoading && !researchIntelligence && (
          <>
            <Divider />
            <div className="space-y-4 py-8">
              <p className="text-sm text-[var(--color-muted)]">
                Updating research…
              </p>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </>
        )}

        {researchError && (
          <>
            <Divider />
            <div className="py-8">
              <p className="text-sm text-[var(--color-muted)]">
                Research data is temporarily unavailable.
              </p>
            </div>
          </>
        )}

        {!researchLoading && !researchError && researchIntelligence && researchIntelligence.evidence.length === 0 && researchIntelligence.keyChanges.length === 0 && (
          <>
            <Divider />
            <div className="py-8">
              <p className="text-sm text-[var(--color-muted)]">
                No recent research evidence available.
              </p>
            </div>
          </>
        )}

        {researchIntelligence && (researchIntelligence.evidence.length > 0 || researchIntelligence.keyChanges.length > 0) && (
          <>
            <Divider />

            <div className="space-y-16">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Primary Research
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
                  Source-Attributed Intelligence
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Factual evidence and events traced to their original sources.
                </p>
              </div>

              <KeyChangesSection keyChanges={researchIntelligence.keyChanges} />

              <Divider className="opacity-30" />

              <SourceAttributedEvidenceSection evidence={researchIntelligence.evidence} />

              <Divider className="opacity-30" />

              <EventsSection events={researchIntelligence.events} />

              <Divider className="opacity-30" />

              <ThesisImpactSection
                impacts={researchIntelligence.thesisImpacts}
                evidence={researchIntelligence.evidence}
              />

              <Divider className="opacity-30" />

              <SourcesSection sources={researchIntelligence.sources} />
            </div>
          </>
        )}

        <Divider className="opacity-50" />

        {/* Research → Thesis Transition */}
        <section className="flex flex-col items-start gap-4 py-4">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-muted)]">
            Ready to formalize your view?
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:text-3xl">
            Turn this research into a structured thesis.
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-[var(--color-body)]">
            Capture your reasoning, define invalidation criteria, and track your conviction over time.
          </p>
          <Button
            onClick={() => navigate(`/thesis/${companyId}`)}
            className="mt-4 px-6 py-2.5 text-base"
          >
            Create Investment Thesis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>
      </div>
    </motion.main>
  );
}

export default ResearchWorkspacePage;
