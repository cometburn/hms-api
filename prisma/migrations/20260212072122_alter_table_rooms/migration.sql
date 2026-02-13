/*
  Warnings:

  - You are about to drop the column `roomRateId` on the `rooms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_roomRateId_fkey";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "roomRateId";
