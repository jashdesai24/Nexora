import { Router } from "express";
import {
  getAllCompanies,
  getCompanyById,
} from "../services/company.service.js";

const router = Router();

// GET /api/companies
router.get("/", (_req, res) => {
  const companies = getAllCompanies();
  res.json({ companies });
});

// GET /api/companies/:companyId
router.get("/:companyId", (req, res) => {
  const company = getCompanyById(req.params["companyId"]!);

  if (!company) {
    res.status(404).json({ error: "Company not found" });
    return;
  }

  res.json({ company });
});

export default router;
