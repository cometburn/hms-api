/*
  Warnings:

  - You are about to drop the column `date_end` on the `room_promos` table. All the data in the column will be lost.
  - You are about to drop the column `date_start` on the `room_promos` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `room_promos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `room_promos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `room_promos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `room_promos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "start_time" SET DATA TYPE TIME,
ALTER COLUMN "end_time" SET DATA TYPE TIME;

-- AlterTable
ALTER TABLE "room_promos" DROP COLUMN "date_end",
DROP COLUMN "date_start",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "start_time",
ADD COLUMN     "start_time" TIME NOT NULL,
DROP COLUMN "end_time",
ADD COLUMN     "end_time" TIME NOT NULL;
