import { Badge } from "../../../components/ui";
import type { ThesisQuality, ConfidenceAssessment } from "../../../domains/jarvis-review";

interface QualityBadgeProps {
  quality: ThesisQuality;
  confidence: ConfidenceAssessment;
}

const qualityTone = {
  Underdeveloped: "red",
  Developing: "amber",
  Structured: "blue",
  "Well-Reasoned": "green",
  Exceptional: "green",
} as const;

const confidenceTone = {
  "Insufficiently Supported": "red",
  "Partially Supported": "amber",
  "Reasonably Supported": "blue",
  "Strongly Supported": "green",
} as const;

function QualityBadge({ quality, confidence }: QualityBadgeProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
          Thesis Quality
        </p>
        <div className="mt-2">
          <Badge tone={qualityTone[quality]}>{quality}</Badge>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
          Confidence Assessment
        </p>
        <div className="mt-2">
          <Badge tone={confidenceTone[confidence]}>{confidence}</Badge>
        </div>
      </div>
    </div>
  );
}

export default QualityBadge;
