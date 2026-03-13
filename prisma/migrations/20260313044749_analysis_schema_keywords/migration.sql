/*
  Warnings:

  - You are about to drop the column `keyword` on the `analysis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "analysis" DROP COLUMN "keyword",
ADD COLUMN     "keywords" TEXT[];
