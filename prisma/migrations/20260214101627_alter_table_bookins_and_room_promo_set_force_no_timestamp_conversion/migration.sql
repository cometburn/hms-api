-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "end_datetime" DROP DEFAULT,
ALTER COLUMN "start_datetime" DROP DEFAULT;

-- AlterTable
ALTER TABLE "room_promos" ALTER COLUMN "end_datetime" DROP DEFAULT,
ALTER COLUMN "start_datetime" DROP DEFAULT;
