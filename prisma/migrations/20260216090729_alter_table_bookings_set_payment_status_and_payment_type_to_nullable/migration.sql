-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "payment_status" DROP NOT NULL,
ALTER COLUMN "payment_type" DROP NOT NULL;
