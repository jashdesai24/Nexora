export interface Company {
  id: string;
  name: string;
  legalName?: string;
  sector: string;
  industry: string;
  identifiers: { type: string; value: string }[];
}
