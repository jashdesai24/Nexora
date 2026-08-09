import { SectionHeader } from "../../../components/ui";
import type { Risk } from "../../../domains/investment-intelligence";
import RiskCard from "../components/RiskCard";

interface RisksSectionProps {
  risks: Risk[];
}

function RisksSection({ risks }: RisksSectionProps) {
  return (
    <section className="space-y-5">
      <SectionHeader
        title="Risks"
        description="Factors that could weaken or invalidate the emerging thesis."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {risks.map((risk) => (
          <RiskCard
            key={risk.id}
            risk={risk}
          />
        ))}
      </div>
    </section>
  );
}

export default RisksSection;
