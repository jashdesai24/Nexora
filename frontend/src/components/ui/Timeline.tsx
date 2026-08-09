import type { ReactNode } from "react";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  meta?: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
}

function Timeline({ items }: TimelineProps) {
  return (
    <ol className="space-y-4">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="grid grid-cols-[auto_minmax(0,1fr)] gap-4"
        >
          <div className="flex flex-col items-center">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
            {index < items.length - 1 && (
              <span className="mt-2 h-full w-px bg-[var(--color-border)]" />
            )}
          </div>

          <div className="pb-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-base font-medium text-[var(--color-text)]">
                {item.title}
              </h3>
              {item.meta && <div>{item.meta}</div>}
            </div>
            {item.description && (
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {item.description}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default Timeline;
