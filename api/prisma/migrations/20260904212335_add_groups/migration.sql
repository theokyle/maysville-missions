/*
  Warnings:

  - You are about to drop the column `taskProgressId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `UserJourney` table. All the data in the column will be lost.
  - You are about to drop the `JourneyTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTaskProgress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stepProgressId` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_taskProgressId_fkey";

-- DropForeignKey
ALTER TABLE "JourneyTask" DROP CONSTRAINT "JourneyTask_journeyId_fkey";

-- DropForeignKey
ALTER TABLE "UserTaskProgress" DROP CONSTRAINT "UserTaskProgress_journeyTaskId_fkey";

-- DropForeignKey
ALTER TABLE "UserTaskProgress" DROP CONSTRAINT "UserTaskProgress_userJourneyId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "taskProgressId",
ADD COLUMN     "stepProgressId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserJourney" DROP COLUMN "completed";

-- DropTable
DROP TABLE "JourneyTask";

-- DropTable
DROP TABLE "UserTaskProgress";

-- CreateTable
CREATE TABLE "JourneyStep" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetCount" INTEGER NOT NULL DEFAULT 1,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JourneyStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStepProgress" (
    "id" TEXT NOT NULL,
    "userJourneyId" TEXT NOT NULL,
    "journeyStepId" TEXT NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UserStepProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupJourney" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "status" "JourneyStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "GroupJourney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupStepProgress" (
    "id" TEXT NOT NULL,
    "groupJourneyId" TEXT NOT NULL,
    "journeyStepId" TEXT NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "GroupStepProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JourneyStep_journeyId_idx" ON "JourneyStep"("journeyId");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyStep_journeyId_sortOrder_key" ON "JourneyStep"("journeyId", "sortOrder");

-- CreateIndex
CREATE INDEX "UserStepProgress_journeyStepId_idx" ON "UserStepProgress"("journeyStepId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStepProgress_userJourneyId_journeyStepId_key" ON "UserStepProgress"("userJourneyId", "journeyStepId");

-- CreateIndex
CREATE INDEX "GroupMember_groupId_idx" ON "GroupMember"("groupId");

-- CreateIndex
CREATE INDEX "GroupMember_userId_idx" ON "GroupMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_groupId_userId_key" ON "GroupMember"("groupId", "userId");

-- CreateIndex
CREATE INDEX "GroupJourney_groupId_idx" ON "GroupJourney"("groupId");

-- CreateIndex
CREATE INDEX "GroupJourney_journeyId_idx" ON "GroupJourney"("journeyId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupJourney_groupId_journeyId_key" ON "GroupJourney"("groupId", "journeyId");

-- CreateIndex
CREATE INDEX "GroupStepProgress_journeyStepId_idx" ON "GroupStepProgress"("journeyStepId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupStepProgress_groupJourneyId_journeyStepId_key" ON "GroupStepProgress"("groupJourneyId", "journeyStepId");

-- AddForeignKey
ALTER TABLE "JourneyStep" ADD CONSTRAINT "JourneyStep_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStepProgress" ADD CONSTRAINT "UserStepProgress_userJourneyId_fkey" FOREIGN KEY ("userJourneyId") REFERENCES "UserJourney"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStepProgress" ADD CONSTRAINT "UserStepProgress_journeyStepId_fkey" FOREIGN KEY ("journeyStepId") REFERENCES "JourneyStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_stepProgressId_fkey" FOREIGN KEY ("stepProgressId") REFERENCES "UserStepProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupJourney" ADD CONSTRAINT "GroupJourney_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupJourney" ADD CONSTRAINT "GroupJourney_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupStepProgress" ADD CONSTRAINT "GroupStepProgress_groupJourneyId_fkey" FOREIGN KEY ("groupJourneyId") REFERENCES "GroupJourney"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupStepProgress" ADD CONSTRAINT "GroupStepProgress_journeyStepId_fkey" FOREIGN KEY ("journeyStepId") REFERENCES "JourneyStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
