import { useEffect, useState } from "react";
import { Telescope } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import CompanyCard from "../components/CompanyCard";
import { getUserWatchlist, type Company } from "../../../domains/watchlist";
import { Button } from "../../../components/ui";

function CompaniesSection() {
  const [watchlist, setWatchlist] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchWatchlist() {
      try {
        const data = await getUserWatchlist();
        if (isMounted) setWatchlist(data);
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)] py-16 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface)] shadow-sm mb-6">
            <Telescope className="h-8 w-8 text-[var(--color-muted)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No companies tracked yet</h3>
          <p className="text-sm text-[var(--color-muted)] max-w-sm mb-6">
            Start investigating companies to add them to your watchlist and track thesis-breaking evidence automatically.
          </p>
          <Link to="/research/hdfc-bank">
            <Button>
              Investigate HDFC Bank
            </Button>
          </Link>
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
