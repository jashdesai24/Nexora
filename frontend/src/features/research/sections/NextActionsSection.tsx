import NextActionsCard from "../components/NextActionsCard";

interface NextActionsSectionProps {
  questions: string[];
}

function NextActionsSection({ questions }: NextActionsSectionProps) {
  return (
    <section>
      <NextActionsCard questions={questions} />
    </section>
  );
}

export default NextActionsSection;
