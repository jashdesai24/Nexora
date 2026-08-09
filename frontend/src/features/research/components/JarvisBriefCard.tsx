import { SectionHeader } from "../../../components/ui";

interface JarvisBriefCardProps {
  whyToday: string;
}

function JarvisBriefCard({ whyToday }: JarvisBriefCardProps) {
  return (
    <div className="py-2">
      <SectionHeader
        eyebrow="Why Today"
        title="Why this company deserves attention now"
      />

      <p className="mt-6 text-lg leading-relaxed text-[var(--color-body)] first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:text-[var(--color-text)] first-line:uppercase first-line:tracking-widest">
        {whyToday}
      </p>
    </div>
  );
}

export default JarvisBriefCard;
