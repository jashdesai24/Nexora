import { motion, type Variants } from "framer-motion";
import DashboardHero from "../features/dashboard/sections/DashboardHero";
import MarketPulseSection from "../features/dashboard/sections/MarketPulseSection";
import DailyBriefingSection from "../features/dashboard/sections/DailyBriefingSection";
import CompaniesSection from "../features/dashboard/sections/CompaniesSection";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};


function DashboardPage() {
  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl space-y-12 px-5 py-8 sm:px-6 lg:px-8 lg:py-12"
    >
      <motion.div variants={itemVariants}>
        <DashboardHero />
      </motion.div>
      <motion.div variants={itemVariants}>
        <MarketPulseSection />
      </motion.div>
      <motion.div variants={itemVariants}>
        <DailyBriefingSection />
      </motion.div>
      <motion.div variants={itemVariants}>
        <CompaniesSection />
      </motion.div>
    </motion.main>
  );
}

export default DashboardPage;
