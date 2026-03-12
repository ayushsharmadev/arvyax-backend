-- CreateTable
CREATE TABLE "journal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ambience" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "keyword" TEXT[],
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "analysis_journalId_key" ON "analysis"("journalId");

-- AddForeignKey
ALTER TABLE "analysis" ADD CONSTRAINT "analysis_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
