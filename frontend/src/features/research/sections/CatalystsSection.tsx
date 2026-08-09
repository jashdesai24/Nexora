import SectionHeader from "../../../components/ui/SectionHeader";
import type { Catalyst } from "../../../domains/investment-intelligence";
import CatalystCard from "../components/CatalystCard";

interface CatalystsSectionProps {
  catalysts: Catalyst[];
}

function CatalystsSection({ catalysts }: CatalystsSectionProps) {
  return (
    <section className="space-y-5">
      <SectionHeader
        title="Catalysts"
        description="Upcoming events that could clarify or challenge the research view."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {catalysts.map((catalyst) => (
          <CatalystCard
            key={catalyst.id}
            catalyst={catalyst}
          />
        ))}
      </div>
    </section>
  );
}

export default CatalystsSection;
