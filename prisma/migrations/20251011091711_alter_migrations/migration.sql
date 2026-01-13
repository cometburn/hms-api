/*
  Warnings:

  - You are about to drop the column `roomRatesId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `roomTypesId` on the `bookings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_roomRatesId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_roomTypesId_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "roomRatesId",
DROP COLUMN "roomTypesId",
ADD COLUMN     "roomRateId" INTEGER,
ADD COLUMN     "roomTypeId" INTEGER;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_roomRateId_fkey" FOREIGN KEY ("roomRateId") REFERENCES "room_rates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "room_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
