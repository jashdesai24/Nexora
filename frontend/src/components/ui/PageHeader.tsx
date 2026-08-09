import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
    >
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.02em] text-[var(--color-text)] sm:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-body)] sm:text-lg sm:leading-8">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </motion.header>
  );
}

export default PageHeader;
