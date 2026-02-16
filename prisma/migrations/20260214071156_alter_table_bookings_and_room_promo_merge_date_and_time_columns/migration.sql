/*
  Warnings:

  - You are about to drop the column `end_date` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `room_promos` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `room_promos` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `room_promos` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `room_promos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "end_date",
DROP COLUMN "end_time",
DROP COLUMN "start_date",
DROP COLUMN "start_time",
ADD COLUMN     "end_datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "start_datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "room_promos" DROP COLUMN "end_date",
DROP COLUMN "end_time",
DROP COLUMN "start_date",
DROP COLUMN "start_time",
ADD COLUMN     "end_datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "start_datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
