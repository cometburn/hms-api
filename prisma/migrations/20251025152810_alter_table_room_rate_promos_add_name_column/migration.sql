/*
  Warnings:

  - You are about to drop the column `day_of_week` on the `room_rate_promos` table. All the data in the column will be lost.
  - Added the required column `name` to the `room_rate_promos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "room_rate_promos" DROP COLUMN "day_of_week",
ADD COLUMN     "days_of_week" INTEGER[],
ADD COLUMN     "name" TEXT NOT NULL;
