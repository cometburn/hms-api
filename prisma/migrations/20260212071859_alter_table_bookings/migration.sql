/*
  Warnings:

  - You are about to drop the column `room_type_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `payment_type` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_room_type_id_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "room_type_id",
DROP COLUMN "type",
ADD COLUMN     "payment_type" TEXT NOT NULL;
