/*
  Warnings:

  - You are about to alter the column `total_price` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "total_price" DROP NOT NULL,
ALTER COLUMN "total_price" SET DATA TYPE DOUBLE PRECISION;
