import type { CanonicalCompany } from "./types.js";

export const mockCompanies: CanonicalCompany[] = [
  {
    id: "hdfc-bank",
    name: "HDFC Bank Ltd",
    sector: "Financial Services",
    industry: "Private Sector Bank",
    isin: "INE040A01034",
    listings: [
      { exchange: "NSE", symbol: "HDFCBANK" },
      { exchange: "BSE", symbol: "HDFCBANK", code: "500180" },
    ],
    providerIds: {},
  },
  {
    id: "reliance",
    name: "Reliance Industries Ltd",
    sector: "Energy",
    industry: "Integrated Oil & Gas",
    isin: "INE002A01018",
    listings: [
      { exchange: "NSE", symbol: "RELIANCE" },
      { exchange: "BSE", symbol: "RELIANCE", code: "500325" },
    ],
    providerIds: {},
  },
  {
    id: "tcs",
    name: "Tata Consultancy Services Ltd",
    sector: "Information Technology",
    industry: "IT Services & Consulting",
    isin: "INE467B01029",
    listings: [
      { exchange: "NSE", symbol: "TCS" },
      { exchange: "BSE", symbol: "TCS", code: "532540" },
    ],
    providerIds: {},
  },
];
