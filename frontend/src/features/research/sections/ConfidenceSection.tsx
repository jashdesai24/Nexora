import ConfidenceCard from "../components/ConfidenceCard";

interface ConfidenceSectionProps {
  confidence: number;
  summary: string;
}

function ConfidenceSection({
  confidence,
  summary,
}: ConfidenceSectionProps) {
  return (
    <section>
      <ConfidenceCard
        confidence={confidence}
        summary={summary}
      />
    </section>
  );
}

export default ConfidenceSection;
