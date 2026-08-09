import { motion } from "framer-motion";
import { Badge } from "../../../components/ui";

function DashboardHero() {
  return (
    <section className="relative py-4 sm:py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <Badge tone="blue" className="mb-6">
          Morning Intelligence
        </Badge>
        
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
          Good morning, Jash.
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-body)] sm:text-xl sm:leading-9">
          Indian markets are showing positive momentum today, led by strength in the banking sector while IT stocks remain under pressure. Keep an eye on companies with strong earnings and unusual trading volume.
        </p>
      </motion.div>
    </section>
  );
}

export default DashboardHero;
