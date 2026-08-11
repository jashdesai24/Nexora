import { prisma } from '../config/db.js';

export interface CreateCompanyPayload {
  id?: string;
  name: string;
  sector?: string;
  industry?: string;
  identifiers?: { type: string; value: string }[];
}

export class CompanyRepository {
  async getCompanyById(id: string) {
    return prisma.company.findUnique({
      where: { id },
      include: {
        identifiers: true,
      }
    });
  }

  async searchCompanies(query: string) {
    return prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { identifiers: { some: { value: { contains: query, mode: 'insensitive' } } } }
        ]
      },
      include: {
        identifiers: true,
      },
      take: 10
    });
  }

  async createCompany(data: CreateCompanyPayload) {
    return prisma.company.create({
      data: {
        id: data.id, // optional, Prisma will auto-generate if missing, but we might want to pass 'hdfc-bank'
        name: data.name,
        sector: data.sector,
        industry: data.industry,
        identifiers: data.identifiers ? {
          create: data.identifiers
        } : undefined
      },
      include: {
        identifiers: true,
      }
    });
  }
}

export const companyRepository = new CompanyRepository();
