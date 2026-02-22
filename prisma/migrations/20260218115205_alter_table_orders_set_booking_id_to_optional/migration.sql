-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_booking_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "booking_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
