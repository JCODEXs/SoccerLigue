/*
  Warnings:

  - You are about to drop the column `referee` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "referee",
ADD COLUMN     "refereeId" TEXT;

-- CreateTable
CREATE TABLE "Referee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Referee_name_key" ON "Referee"("name");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "Referee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
