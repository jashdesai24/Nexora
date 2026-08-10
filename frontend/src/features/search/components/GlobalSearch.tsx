import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Building2 } from "lucide-react";
import { searchCompanies, type Company } from "../../../domains/company";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<Company[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchResults() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const companies = await searchCompanies(debouncedQuery);
        setResults(companies);
        setIsOpen(true);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }
    fetchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (companyId: string) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/research/${companyId}`);
  };

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-[var(--color-muted)]" />
        <input
          type="text"
          placeholder="Search companies by name or symbol..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen && e.target.value) setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          className="h-10 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] pl-10 pr-10 text-sm outline-none transition-colors focus:border-[var(--color-border-strong)] focus:ring-1 focus:ring-[var(--color-accent)]"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-[var(--color-muted)]" />
        )}
      </div>

      {isOpen && (debouncedQuery.trim() !== "") && (
        <div className="absolute top-12 z-50 w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
          {results.length === 0 && !isSearching ? (
            <div className="p-4 text-center text-sm text-[var(--color-muted)]">
              No companies found for "{debouncedQuery}"
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-2">
              {results.map((company) => (
                <li key={company.id}>
                  <button
                    onClick={() => handleSelect(company.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-soft)]"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg-secondary)]">
                      <Building2 className="h-5 w-5 text-[var(--color-muted)]" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-sm font-medium text-[var(--color-text)]">
                        {company.name}
                      </span>
                      <span className="truncate text-xs text-[var(--color-muted)]">
                        {company.sector} • {company.identifiers[0]?.value}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
