-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "room_promos" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
