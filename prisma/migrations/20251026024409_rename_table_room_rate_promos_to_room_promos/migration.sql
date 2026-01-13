/*
  Warnings:

  - You are about to drop the `room_rate_promos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "room_rate_promos" DROP CONSTRAINT "room_rate_promos_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "room_rate_promos" DROP CONSTRAINT "room_rate_promos_room_rate_id_fkey";

-- DropTable
DROP TABLE "room_rate_promos";

-- CreateTable
CREATE TABLE "room_promos" (
    "id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "room_rate_id" INTEGER NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_end" TIMESTAMP(3) NOT NULL,
    "days_of_week" INTEGER[],
    "time_start" TEXT,
    "time_end" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "extra_person_rate" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_promos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "room_promos" ADD CONSTRAINT "room_promos_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_promos" ADD CONSTRAINT "room_promos_room_rate_id_fkey" FOREIGN KEY ("room_rate_id") REFERENCES "room_rates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
