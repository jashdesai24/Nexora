import SectionHeader from "../../../components/ui/SectionHeader";
import MarketPulseCard from "../components/MarketPulseCard";
import { marketPulse } from "../data/marketPulse";

function MarketPulseSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title="Market Pulse"
        description="A compact read on the market backdrop before deeper company research."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {marketPulse.map((item) => (
          <MarketPulseCard
            key={item.title}
            title={item.title}
            value={item.value}
            change={item.change}
            positive={item.positive}
          />
        ))}
      </div>
    </section>
  );
}

export default MarketPulseSection;
