/*
  Warnings:

  - You are about to drop the column `unit_price` on the `order_items` table. All the data in the column will be lost.
  - You are about to alter the column `total_price` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "booking_addons" ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "total_price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "unit_price",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "total_price" SET DEFAULT 0,
ALTER COLUMN "total_price" SET DATA TYPE DOUBLE PRECISION;
