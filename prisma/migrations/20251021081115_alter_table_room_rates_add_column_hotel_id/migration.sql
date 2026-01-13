/*
  Warnings:

  - Added the required column `hotel_id` to the `room_rates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "room_rates" ADD COLUMN     "hotel_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "room_rates" ADD CONSTRAINT "room_rates_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
