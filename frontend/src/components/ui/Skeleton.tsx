import { cn } from "../../utils/cn";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[var(--color-surface-soft)] opacity-60",
        className
      )}
    />
  );
}

export default Skeleton;
