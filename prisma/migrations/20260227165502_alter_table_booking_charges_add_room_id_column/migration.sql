/*
  Warnings:

  - You are about to drop the column `note` on the `booking_charges` table. All the data in the column will be lost.
  - Added the required column `room_id` to the `booking_charges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking_charges" DROP COLUMN "note",
ADD COLUMN     "room_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "booking_charges_room_id_idx" ON "booking_charges"("room_id");

-- AddForeignKey
ALTER TABLE "booking_charges" ADD CONSTRAINT "booking_charges_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
