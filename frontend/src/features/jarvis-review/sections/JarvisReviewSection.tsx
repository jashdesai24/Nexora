import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Divider } from "../../../components/ui";
import type { JarvisReview, ThesisSectionTarget } from "../../../domains/jarvis-review";

import OverallAssessment from "../components/OverallAssessment";
import QualityBadge from "../components/QualityBadge";
import StrengthsList from "../components/StrengthsList";
import GapsList from "../components/GapsList";
import QuestionsList from "../components/QuestionsList";

interface JarvisReviewSectionProps {
  review: JarvisReview;
  isOutdated?: boolean;
  onAddressGap?: (targetSection: ThesisSectionTarget) => void;
  onReviewAgain?: () => void;
}

function JarvisReviewSection({
  review,
  isOutdated = false,
  onAddressGap,
  onReviewAgain,
}: JarvisReviewSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-16"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
            Jarvis Review
          </h2>
          <p className="mt-2 text-base text-[var(--color-body)]">
            An independent assessment of your thesis structure and reasoning quality.
          </p>
        </div>

        {isOutdated && onReviewAgain && (
          <button
            type="button"
            onClick={onReviewAgain}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/5 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-400/10 focus:outline-none"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Thesis changed — review again
          </button>
        )}
      </div>

      <QualityBadge
        quality={review.thesisQuality}
        confidence={review.confidenceAssessment}
      />

      <Divider className="opacity-30" />

      <OverallAssessment
        assessment={review.overallAssessment}
        reviewedAt={review.reviewedAt}
      />

      <Divider className="opacity-30" />

      <StrengthsList strengths={review.strengths} />

      <Divider className="opacity-30" />

      <GapsList gaps={review.gaps} onAddressGap={onAddressGap} />

      <Divider className="opacity-30" />

      <QuestionsList questions={review.questions} />
    </motion.section>
  );
}

export default JarvisReviewSection;
