import type { ReactNode } from "react";
import Card from "./Card";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="text-center">
      <h3 className="text-lg font-semibold text-[var(--color-text)]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-muted)]">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}

export default EmptyState;
