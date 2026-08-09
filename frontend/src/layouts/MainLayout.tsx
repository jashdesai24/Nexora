import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

import TopNavigation from "../components/navigation/TopNavigation";

function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen text-[var(--color-text)]">
      <TopNavigation />
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}

export default MainLayout;
