// --- Canonical Company Identity ---

export type Exchange = "NSE" | "BSE";

export interface ExchangeListing {
  exchange: Exchange;
  symbol: string;
  code?: string;
}

export interface CanonicalCompany {
  id: string;
  name: string;
  sector: string;
  industry: string;
  isin?: string;
  listings: ExchangeListing[];
  providerIds: Record<string, string>;
}
