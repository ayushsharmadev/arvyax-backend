/*
  Warnings:

  - Changed the type of `ambience` on the `journal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AmbienceEnum" AS ENUM ('forest', 'ocean', 'mountain');

-- AlterTable
ALTER TABLE "journal" DROP COLUMN "ambience",
ADD COLUMN     "ambience" "AmbienceEnum" NOT NULL;
