-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT,
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyIdentifier" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "CompanyIdentifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentThesis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "supportingReasons" TEXT NOT NULL,
    "risks" TEXT NOT NULL,
    "invalidationCriteria" TEXT NOT NULL,
    "conviction" INTEGER NOT NULL DEFAULT 50,
    "timeHorizon" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentThesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentThesisVersion" (
    "id" TEXT NOT NULL,
    "thesisId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "supportingReasons" TEXT NOT NULL,
    "risks" TEXT NOT NULL,
    "invalidationCriteria" TEXT NOT NULL,
    "conviction" INTEGER NOT NULL,
    "timeHorizon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentThesisVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JarvisReview" (
    "id" TEXT NOT NULL,
    "thesisId" TEXT NOT NULL,
    "overallAssessment" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "gaps" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "thesisQuality" TEXT NOT NULL,
    "confidenceAssessment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JarvisReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThesisImpact" (
    "id" TEXT NOT NULL,
    "thesisId" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThesisImpact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "url" TEXT,
    "category" TEXT NOT NULL,
    "freshness" TEXT,
    "materiality" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "retrievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchEvent" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResearchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "CompanyIdentifier_companyId_idx" ON "CompanyIdentifier"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyIdentifier_type_value_key" ON "CompanyIdentifier"("type", "value");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_companyId_key" ON "Watchlist"("userId", "companyId");

-- CreateIndex
CREATE INDEX "InvestmentThesis_userId_idx" ON "InvestmentThesis"("userId");

-- CreateIndex
CREATE INDEX "InvestmentThesis_companyId_idx" ON "InvestmentThesis"("companyId");

-- CreateIndex
CREATE INDEX "InvestmentThesisVersion_thesisId_idx" ON "InvestmentThesisVersion"("thesisId");

-- CreateIndex
CREATE INDEX "JarvisReview_thesisId_idx" ON "JarvisReview"("thesisId");

-- CreateIndex
CREATE UNIQUE INDEX "ThesisImpact_thesisId_evidenceId_key" ON "ThesisImpact"("thesisId", "evidenceId");

-- CreateIndex
CREATE INDEX "Evidence_companyId_idx" ON "Evidence"("companyId");

-- CreateIndex
CREATE INDEX "Evidence_sourceId_idx" ON "Evidence"("sourceId");

-- CreateIndex
CREATE INDEX "Evidence_publishedAt_idx" ON "Evidence"("publishedAt");

-- CreateIndex
CREATE INDEX "Evidence_retrievedAt_idx" ON "Evidence"("retrievedAt");

-- CreateIndex
CREATE INDEX "ResearchEvent_companyId_idx" ON "ResearchEvent"("companyId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyIdentifier" ADD CONSTRAINT "CompanyIdentifier_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentThesis" ADD CONSTRAINT "InvestmentThesis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentThesis" ADD CONSTRAINT "InvestmentThesis_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentThesisVersion" ADD CONSTRAINT "InvestmentThesisVersion_thesisId_fkey" FOREIGN KEY ("thesisId") REFERENCES "InvestmentThesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JarvisReview" ADD CONSTRAINT "JarvisReview_thesisId_fkey" FOREIGN KEY ("thesisId") REFERENCES "InvestmentThesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThesisImpact" ADD CONSTRAINT "ThesisImpact_thesisId_fkey" FOREIGN KEY ("thesisId") REFERENCES "InvestmentThesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThesisImpact" ADD CONSTRAINT "ThesisImpact_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchEvent" ADD CONSTRAINT "ResearchEvent_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
