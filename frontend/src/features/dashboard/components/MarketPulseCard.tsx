import StatCard from "../../../components/ui/StatCard";

interface MarketPulseCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
}

function MarketPulseCard({
  title,
  value,
  change,
  positive,
}: MarketPulseCardProps) {
  return (
    <StatCard
      title={title}
      value={value}
      change={change}
      tone={positive ? "green" : "red"}
    />
  );
}

export default MarketPulseCard;
