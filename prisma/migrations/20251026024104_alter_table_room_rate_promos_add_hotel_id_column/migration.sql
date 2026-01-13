/*
  Warnings:

  - Added the required column `hotel_id` to the `room_rate_promos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "room_rate_promos" ADD COLUMN     "hotel_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "room_rate_promos" ADD CONSTRAINT "room_rate_promos_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
