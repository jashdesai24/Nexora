import { Router } from "express";
import {
  getAllCompanies,
  getCompanyById,
  searchCompanies,
} from "../services/company.service.js";

const router = Router();

// GET /api/companies/search
router.get("/search", async (req, res, next) => {
  try {
    const q = req.query["q"] as string;
    if (!q) {
      res.json({ companies: [] });
      return;
    }
    const companies = await searchCompanies(q);
    res.json({ companies });
  } catch (error) {
    next(error);
  }
});

// GET /api/companies
router.get("/", async (_req, res, next) => {
  try {
    const companies = await getAllCompanies();
    res.json({ companies });
  } catch (error) {
    next(error);
  }
});

// GET /api/companies/:companyId
router.get("/:companyId", async (req, res, next) => {
  try {
    const company = await getCompanyById(req.params["companyId"]!);

    if (!company) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Company not found' } });
      return;
    }

    res.json({ company });
  } catch (error) {
    next(error);
  }
});

export default router;
