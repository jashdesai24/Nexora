import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, Sparkles } from "lucide-react";

import { getInvestmentThesis, type InvestmentThesis } from "../../../domains/investment-thesis";
import {
  getInvestmentIntelligence,
  type InvestmentIntelligence,
} from "../../../domains/investment-intelligence";
import { getJarvisReview, type JarvisReview, type ThesisSectionTarget } from "../../../domains/jarvis-review";
import Skeleton from "../../../components/ui/Skeleton";
import { Button, Divider } from "../../../components/ui";
import { cn } from "../../../utils/cn";

import ThesisHeader from "../sections/ThesisHeader";
import ThesisStatementSection from "../sections/ThesisStatementSection";
import ListEditorSection from "../sections/ListEditorSection";
import ConvictionSection from "../sections/ConvictionSection";
import HorizonSection from "../sections/HorizonSection";
import ResearchContextPanel from "../sections/ResearchContextPanel";
import JarvisReviewSection from "../../jarvis-review/sections/JarvisReviewSection";

function ThesisBuilderPage() {
  const { companyId = "hdfc-bank" } = useParams();
  const [thesis, setThesis] = useState<InvestmentThesis | null>(null);
  const [intelligence, setIntelligence] = useState<InvestmentIntelligence | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Jarvis Review state
  const [review, setReview] = useState<JarvisReview | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isReviewOutdated, setIsReviewOutdated] = useState(false);
  const [isReviewError, setIsReviewError] = useState(false);

  // Section focus highlight
  const [highlightedSection, setHighlightedSection] = useState<ThesisSectionTarget | null>(null);

  // Section refs for scroll targeting
  const sectionRefs = useRef<Record<ThesisSectionTarget, HTMLDivElement | null>>({
    "thesis-statement": null,
    "supporting-reasons": null,
    "risks": null,
    "invalidation-criteria": null,
    "conviction": null,
    "horizon": null,
  });

  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      const [thesisResult, intelligenceResult] = await Promise.all([
        getInvestmentThesis(companyId),
        getInvestmentIntelligence(companyId),
      ]);

      if (isCurrent) {
        if (thesisResult) setThesis(thesisResult);
        setIntelligence(intelligenceResult);
      }
    }

    void loadData();

    return () => {
      isCurrent = false;
    };
  }, [companyId]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
  };

  const handleReview = async () => {
    if (!thesis) return;
    setIsReviewing(true);
    setIsReviewOutdated(false);
    setIsReviewError(false);
    
    try {
      const result = await getJarvisReview(thesis.id);
      if (result) {
        setReview(result);
      } else {
        setIsReviewError(true);
      }
    } catch {
      setIsReviewError(true);
    } finally {
      setIsReviewing(false);
    }
  };

  // Mark review as outdated when thesis is modified
  const handleThesisChange = useCallback(
    (updater: (prev: InvestmentThesis) => InvestmentThesis) => {
      setThesis((prev) => {
        if (!prev) return prev;
        return updater(prev);
      });
      if (review) {
        setIsReviewOutdated(true);
      }
    },
    [review]
  );

  // Scroll to and highlight a thesis section
  const handleAddressGap = useCallback((targetSection: ThesisSectionTarget) => {
    const el = sectionRefs.current[targetSection];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedSection(targetSection);
      setTimeout(() => setHighlightedSection(null), 2000);
    }
  }, []);

  if (!thesis) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-48 w-full" />
      </main>
    );
  }

  const sectionHighlight = (section: ThesisSectionTarget) =>
    cn(
      "rounded-2xl transition-all duration-700",
      highlightedSection === section
        ? "bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]/20 px-5 py-6 -mx-5"
        : ""
    );

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-3xl px-5 py-12 pb-32 sm:px-6 lg:px-8 lg:py-16"
    >
      <ThesisHeader
        companyName={companyId === "hdfc-bank" ? "HDFC Bank" : thesis.title}
        status={thesis.status}
        updatedAt={thesis.updatedAt}
        conviction={thesis.conviction}
      />

      {intelligence && (
        <div className="mt-12">
          <ResearchContextPanel intelligence={intelligence} />
        </div>
      )}

      <div className="mt-20 space-y-20">
        <div
          ref={(el) => { sectionRefs.current["thesis-statement"] = el; }}
          className={sectionHighlight("thesis-statement")}
        >
          <ThesisStatementSection
            value={thesis.thesis}
            onChange={(val) => handleThesisChange((prev) => ({ ...prev, thesis: val }))}
          />
        </div>

        <Divider className="opacity-50" />

        <div
          ref={(el) => { sectionRefs.current["supporting-reasons"] = el; }}
          className={sectionHighlight("supporting-reasons")}
        >
          <ListEditorSection
            title="Supporting Reasons"
            items={thesis.supportingReasons}
            onChange={(items) => handleThesisChange((prev) => ({ ...prev, supportingReasons: items }))}
            placeholder="Add a supporting structural reason..."
          />
        </div>

        <Divider className="opacity-50" />

        <div
          ref={(el) => { sectionRefs.current["risks"] = el; }}
          className={sectionHighlight("risks")}
        >
          <ListEditorSection
            title="Risks"
            items={thesis.risks}
            onChange={(items) => handleThesisChange((prev) => ({ ...prev, risks: items }))}
            placeholder="Add a potential risk factor..."
          />
        </div>

        <Divider className="opacity-50" />

        <div
          ref={(el) => { sectionRefs.current["invalidation-criteria"] = el; }}
          className={sectionHighlight("invalidation-criteria")}
        >
          <ListEditorSection
            title="Invalidation Criteria"
            promptText="What evidence would prove your thesis wrong?"
            items={thesis.invalidationCriteria}
            onChange={(items) => handleThesisChange((prev) => ({ ...prev, invalidationCriteria: items }))}
            placeholder="e.g. Operating margins compress below 15% for two consecutive quarters..."
          />
        </div>

        <Divider className="opacity-50" />

        <div
          ref={(el) => { sectionRefs.current["horizon"] = el; }}
          className={sectionHighlight("horizon")}
        >
          <HorizonSection
            value={thesis.timeHorizon}
            onChange={(val) => handleThesisChange((prev) => ({ ...prev, timeHorizon: val }))}
          />
        </div>

        <Divider className="opacity-50" />

        <div
          ref={(el) => { sectionRefs.current["conviction"] = el; }}
          className={sectionHighlight("conviction")}
        >
          <ConvictionSection
            value={thesis.conviction}
            onChange={(val) => handleThesisChange((prev) => ({ ...prev, conviction: val }))}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-8">
          <Button onClick={handleSave} disabled={isSaving} className="px-8 py-3 text-base">
            <Save className="mr-2 h-5 w-5" />
            {isSaving ? "Saving..." : "Save Thesis"}
          </Button>

          <Button
            variant="secondary"
            onClick={handleReview}
            disabled={isReviewing}
            className="px-6 py-3 text-base"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {isReviewing ? "Reviewing..." : "Review with Jarvis"}
          </Button>
        </div>

        {/* Review loading state */}
        {isReviewing && (
          <div className="space-y-4 pt-4">
            <p className="text-sm text-[var(--color-muted)]">
              Jarvis is reviewing the available evidence...
            </p>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}
        
        {/* Review error state */}
        {isReviewError && !isReviewing && (
          <>
            <Divider />
            <div className="py-8">
              <p className="text-sm text-red-500">
                Jarvis is temporarily unavailable.
              </p>
            </div>
          </>
        )}

        {/* Jarvis Review */}
        {review && !isReviewing && !isReviewError && (
          <>
            <Divider />
            <JarvisReviewSection
              review={review}
              isOutdated={isReviewOutdated}
              onAddressGap={handleAddressGap}
              onReviewAgain={handleReview}
            />
          </>
        )}
      </div>
    </motion.main>
  );
}

export default ThesisBuilderPage;
