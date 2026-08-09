import SectionHeader from "../../../components/ui/SectionHeader";
import CompanyCard from "../components/CompanyCard";
import { companies } from "../data/companies";

function CompaniesSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title="Companies Worth Investigating"
        description="Companies surfaced for structured reasoning, not recommendations."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            name={company.name}
            reason={company.reason}
            confidence={company.confidence}
          />
        ))}
      </div>
    </section>
  );
}

export default CompaniesSection;
