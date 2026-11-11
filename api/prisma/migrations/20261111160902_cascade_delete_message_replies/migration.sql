/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Journey` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "JourneyMessage" DROP CONSTRAINT "JourneyMessage_parentId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Journey_title_key" ON "Journey"("title");

-- AddForeignKey
ALTER TABLE "JourneyMessage" ADD CONSTRAINT "JourneyMessage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "JourneyMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
