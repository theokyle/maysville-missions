/*
  Warnings:

  - A unique constraint covering the columns `[journeyInstanceId,journeyStepId,userId]` on the table `JourneyStepInstance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `JourneyStepInstance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "JourneyStepInstance_journeyInstanceId_journeyStepId_key";

-- AlterTable
ALTER TABLE "Journey" ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "JourneyStep" ADD COLUMN     "groupChatPrompt" TEXT,
ADD COLUMN     "requiresGroupPost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "JourneyStepInstance" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "JourneyMessage" (
    "id" TEXT NOT NULL,
    "journeyInstanceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "journeyStepId" TEXT,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JourneyMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JourneyMessage_journeyInstanceId_createdAt_idx" ON "JourneyMessage"("journeyInstanceId", "createdAt");

-- CreateIndex
CREATE INDEX "JourneyMessage_journeyInstanceId_journeyStepId_createdAt_idx" ON "JourneyMessage"("journeyInstanceId", "journeyStepId", "createdAt");

-- CreateIndex
CREATE INDEX "JourneyMessage_userId_journeyInstanceId_journeyStepId_idx" ON "JourneyMessage"("userId", "journeyInstanceId", "journeyStepId");

-- CreateIndex
CREATE INDEX "JourneyMessage_parentId_idx" ON "JourneyMessage"("parentId");

-- CreateIndex
CREATE INDEX "JourneyStepInstance_userId_idx" ON "JourneyStepInstance"("userId");

-- CreateIndex
CREATE INDEX "JourneyStepInstance_journeyInstanceId_idx" ON "JourneyStepInstance"("journeyInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyStepInstance_journeyInstanceId_journeyStepId_userId_key" ON "JourneyStepInstance"("journeyInstanceId", "journeyStepId", "userId");

-- AddForeignKey
ALTER TABLE "JourneyStepInstance" ADD CONSTRAINT "JourneyStepInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyMessage" ADD CONSTRAINT "JourneyMessage_journeyInstanceId_fkey" FOREIGN KEY ("journeyInstanceId") REFERENCES "JourneyInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyMessage" ADD CONSTRAINT "JourneyMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyMessage" ADD CONSTRAINT "JourneyMessage_journeyStepId_fkey" FOREIGN KEY ("journeyStepId") REFERENCES "JourneyStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyMessage" ADD CONSTRAINT "JourneyMessage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "JourneyMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
