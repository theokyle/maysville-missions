/*
  Warnings:

  - You are about to drop the column `groupStepProgressId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `userStepProgressId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the `GroupJourney` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupStepProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserJourney` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserStepProgress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stepInstanceId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_groupStepProgressId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userStepProgressId_fkey";

-- DropForeignKey
ALTER TABLE "GroupJourney" DROP CONSTRAINT "GroupJourney_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupJourney" DROP CONSTRAINT "GroupJourney_journeyId_fkey";

-- DropForeignKey
ALTER TABLE "GroupStepProgress" DROP CONSTRAINT "GroupStepProgress_groupJourneyId_fkey";

-- DropForeignKey
ALTER TABLE "GroupStepProgress" DROP CONSTRAINT "GroupStepProgress_journeyStepId_fkey";

-- DropForeignKey
ALTER TABLE "UserJourney" DROP CONSTRAINT "UserJourney_journeyId_fkey";

-- DropForeignKey
ALTER TABLE "UserJourney" DROP CONSTRAINT "UserJourney_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserStepProgress" DROP CONSTRAINT "UserStepProgress_journeyStepId_fkey";

-- DropForeignKey
ALTER TABLE "UserStepProgress" DROP CONSTRAINT "UserStepProgress_userJourneyId_fkey";

-- DropIndex
DROP INDEX "Activity_groupStepProgressId_idx";

-- DropIndex
DROP INDEX "Activity_userStepProgressId_idx";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "groupStepProgressId",
DROP COLUMN "userStepProgressId",
ADD COLUMN     "stepInstanceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "GroupJourney";

-- DropTable
DROP TABLE "GroupStepProgress";

-- DropTable
DROP TABLE "UserJourney";

-- DropTable
DROP TABLE "UserStepProgress";

-- CreateTable
CREATE TABLE "JourneyInstance" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "userId" TEXT,
    "groupId" TEXT,
    "status" "JourneyStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "JourneyInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyStepInstance" (
    "id" TEXT NOT NULL,
    "journeyInstanceId" TEXT NOT NULL,
    "journeyStepId" TEXT NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "JourneyStepInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JourneyInstance_journeyId_idx" ON "JourneyInstance"("journeyId");

-- CreateIndex
CREATE INDEX "JourneyInstance_userId_idx" ON "JourneyInstance"("userId");

-- CreateIndex
CREATE INDEX "JourneyInstance_groupId_idx" ON "JourneyInstance"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyInstance_journeyId_userId_key" ON "JourneyInstance"("journeyId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyInstance_journeyId_groupId_key" ON "JourneyInstance"("journeyId", "groupId");

-- CreateIndex
CREATE INDEX "JourneyStepInstance_journeyStepId_idx" ON "JourneyStepInstance"("journeyStepId");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyStepInstance_journeyInstanceId_journeyStepId_key" ON "JourneyStepInstance"("journeyInstanceId", "journeyStepId");

-- CreateIndex
CREATE INDEX "Activity_stepInstanceId_idx" ON "Activity"("stepInstanceId");

-- AddForeignKey
ALTER TABLE "JourneyInstance" ADD CONSTRAINT "JourneyInstance_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyInstance" ADD CONSTRAINT "JourneyInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyInstance" ADD CONSTRAINT "JourneyInstance_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyStepInstance" ADD CONSTRAINT "JourneyStepInstance_journeyInstanceId_fkey" FOREIGN KEY ("journeyInstanceId") REFERENCES "JourneyInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyStepInstance" ADD CONSTRAINT "JourneyStepInstance_journeyStepId_fkey" FOREIGN KEY ("journeyStepId") REFERENCES "JourneyStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_stepInstanceId_fkey" FOREIGN KEY ("stepInstanceId") REFERENCES "JourneyStepInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
