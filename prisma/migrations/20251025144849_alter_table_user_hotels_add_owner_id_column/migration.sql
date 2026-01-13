/*
  Warnings:

  - You are about to drop the column `parent_user_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_parent_user_id_fkey";

-- AlterTable
ALTER TABLE "user_hotels" ADD COLUMN     "owner_id" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "parent_user_id";

-- AddForeignKey
ALTER TABLE "user_hotels" ADD CONSTRAINT "user_hotels_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
