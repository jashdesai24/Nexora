import JarvisBriefCard from "../components/JarvisBriefCard";

interface WhyTodaySectionProps {
  whyToday: string;
}

function WhyTodaySection({ whyToday }: WhyTodaySectionProps) {
  return (
    <section>
      <JarvisBriefCard whyToday={whyToday} />
    </section>
  );
}

export default WhyTodaySection;
