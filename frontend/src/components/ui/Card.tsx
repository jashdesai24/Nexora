import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClassName = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-7",
};

function Card({
  children,
  className = "",
  padding = "lg",
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "rounded-2xl bg-[var(--color-surface)] ring-1 ring-white/5",
        "shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-shadow hover:shadow-[0_24px_80px_rgba(0,0,0,0.3)]",
        paddingClassName[padding],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export default Card;
