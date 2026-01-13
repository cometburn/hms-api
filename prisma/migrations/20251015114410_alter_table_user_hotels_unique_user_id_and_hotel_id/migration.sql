/*
  Warnings:

  - A unique constraint covering the columns `[user_id,hotel_id]` on the table `user_hotels` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "unique_default_hotel_per_user";

-- CreateIndex
CREATE UNIQUE INDEX "user_hotels_user_id_hotel_id_key" ON "user_hotels"("user_id", "hotel_id");
