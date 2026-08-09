import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getThesisVersions, type InvestmentThesisVersion } from "../../../domains/investment-thesis";

interface ThesisHistoryPanelProps {
  thesisId: string;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ThesisHistoryPanel({ thesisId, isOpen, onClose }: ThesisHistoryPanelProps) {
  const [versions, setVersions] = useState<InvestmentThesisVersion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      if (isOpen && thesisId) {
        setLoading(true);
        try {
          const data = await getThesisVersions(thesisId);
          if (isCurrent) setVersions(data);
        } catch (err) {
          console.error("Failed to fetch thesis versions", err);
        } finally {
          if (isCurrent) setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isCurrent = false;
    };
  }, [isOpen, thesisId]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--color-background)] border-l border-[var(--color-border)] shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)] px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)]">
            Thesis History
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="text-sm text-[var(--color-muted)]">Loading versions...</span>
            </div>
          ) : versions.length === 0 ? (
            <div className="flex justify-center py-10">
              <span className="text-sm text-[var(--color-muted)]">No historical versions found.</span>
            </div>
          ) : (
            <ul className="space-y-8">
              {versions.map((version, index) => (
                <li key={version.id} className="relative">
                  {index !== versions.length - 1 && (
                    <div className="absolute left-2.5 top-6 h-full w-px bg-[var(--color-border)]" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-5 w-5 shrink-0 rounded-full border-4 border-[var(--color-background)] bg-blue-500" />
                    
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {index === 0 ? "Current Version" : `Version ${versions.length - index}`}
                      </p>
                      <p className="text-xs text-[var(--color-muted)] mt-1">
                        {formatDate(version.createdAt)}
                      </p>
                      
                      <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                        <div className="text-xs font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">Conviction</div>
                        <p className="text-sm text-[var(--color-text)] font-medium mb-3">{version.conviction}%</p>

                        <div className="text-xs font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">Statement</div>
                        <p className="text-sm text-[var(--color-text)] line-clamp-3">{version.statement}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
