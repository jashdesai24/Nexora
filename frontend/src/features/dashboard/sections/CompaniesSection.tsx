import { useEffect, useState } from "react";
import { Telescope, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import CompanyCard from "../components/CompanyCard";
import { getUserWatchlist, type Company as WatchlistCompany } from "../../../domains/watchlist";
import { getAllCompanies, type Company } from "../../../domains/company";
function CompaniesSection() {
  const [watchlist, setWatchlist] = useState<WatchlistCompany[]>([]);
  const [popular, setPopular] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchWatchlist() {
      try {
        const data = await getUserWatchlist();
        if (isMounted) setWatchlist(data);

        // Fetch popular companies if watchlist is empty
        if (data.length === 0) {
          const allCompanies = await getAllCompanies();
          if (isMounted) setPopular(allCompanies.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch watchlist", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    void fetchWatchlist();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Your Tracked Companies"
        description="Companies surfaced for structured reasoning, not recommendations."
      />

      {isLoading ? (
        <div className="py-12 text-center text-sm text-[var(--color-muted)]">
          Loading your watchlist...
        </div>
      ) : watchlist.length === 0 ? (
        <div className="flex flex-col rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)] py-12 px-6">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface)] shadow-sm mb-6">
              <Telescope className="h-8 w-8 text-[var(--color-muted)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No companies tracked yet</h3>
            <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
              Start investigating companies using the search bar above to add them to your watchlist and track thesis-breaking evidence.
            </p>
          </div>

          {popular.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6 px-2">
                <TrendingUp className="h-4 w-4 text-[var(--color-accent)]" />
                <h4 className="text-sm font-medium text-[var(--color-text)] uppercase tracking-wider">
                  Popular Companies
                </h4>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {popular.map((company) => (
                  <Link
                    key={company.id}
                    to={`/research/${company.id}`}
                    className="flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-bg-secondary)] font-semibold text-[var(--color-text)]">
                        {company.name.charAt(0)}
                      </div>
                      <span className="rounded-full bg-[var(--color-surface-soft)] px-2 py-1 text-xs font-medium text-[var(--color-muted)]">
                        {company.identifiers[0]?.value}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">{company.name}</h3>
                    <p className="text-xs text-[var(--color-muted)]">{company.sector}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {watchlist.map((company) => (
            <CompanyCard
              key={company.id}
              id={company.id}
              name={company.name}
              sector={company.sector}
              industry={company.industry}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default CompaniesSection;
