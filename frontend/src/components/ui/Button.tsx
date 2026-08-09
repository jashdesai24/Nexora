import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils/cn";

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

const variantClassName = {
  primary:
    "border-transparent bg-[var(--color-accent)] text-white shadow-sm hover:bg-[var(--color-accent-strong)]",
  secondary:
    "border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text)] hover:border-[var(--color-border-strong)]",
  ghost:
    "border-transparent bg-transparent text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]",
};

function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
        variantClassName[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
