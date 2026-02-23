/*
  Warnings:

  - A unique constraint covering the columns `[booking_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "orders_booking_id_key" ON "orders"("booking_id");
