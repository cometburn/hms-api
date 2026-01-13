/*
  Warnings:

  - Added the required column `name` to the `room_rates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "room_rates" ADD COLUMN     "name" TEXT NOT NULL;
