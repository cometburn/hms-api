/*
  Warnings:

  - You are about to drop the column `overstay_fee` on the `room_rates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "room_rates" DROP COLUMN "overstay_fee",
ADD COLUMN     "overstay_rate" DOUBLE PRECISION NOT NULL DEFAULT 0;
