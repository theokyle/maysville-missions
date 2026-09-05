/*
  Warnings:

  - You are about to drop the column `stepProgressId` on the `Activity` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "JourneyType" AS ENUM ('INDIVIDUAL', 'GROUP');

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_stepProgressId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "stepProgressId",
ADD COLUMN     "groupStepProgressId" TEXT,
ADD COLUMN     "userStepProgressId" TEXT;

-- AlterTable
ALTER TABLE "Journey" ADD COLUMN     "type" "JourneyType" NOT NULL DEFAULT 'INDIVIDUAL';

-- CreateIndex
CREATE INDEX "Activity_userId_idx" ON "Activity"("userId");

-- CreateIndex
CREATE INDEX "Activity_userStepProgressId_idx" ON "Activity"("userStepProgressId");

-- CreateIndex
CREATE INDEX "Activity_groupStepProgressId_idx" ON "Activity"("groupStepProgressId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userStepProgressId_fkey" FOREIGN KEY ("userStepProgressId") REFERENCES "UserStepProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_groupStepProgressId_fkey" FOREIGN KEY ("groupStepProgressId") REFERENCES "GroupStepProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
