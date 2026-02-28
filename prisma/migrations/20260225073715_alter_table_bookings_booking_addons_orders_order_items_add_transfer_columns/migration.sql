-- AlterTable
ALTER TABLE "booking_addons" ADD COLUMN     "added_before_transfer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "original_booking_addon_id" INTEGER,
ADD COLUMN     "transferred_from_booking_id" INTEGER;

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "original_room_id" INTEGER,
ADD COLUMN     "transfer_reason" TEXT,
ADD COLUMN     "transferred_at" TIMESTAMP(3),
ADD COLUMN     "transferred_from_booking_id" INTEGER;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "added_before_transfer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "original_order_item_id" INTEGER,
ADD COLUMN     "transferred_from_booking_id" INTEGER;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "transferred_from_booking_id" INTEGER;

-- CreateIndex
CREATE INDEX "booking_addons_booking_id_idx" ON "booking_addons"("booking_id");

-- CreateIndex
CREATE INDEX "booking_addons_transferred_from_booking_id_idx" ON "booking_addons"("transferred_from_booking_id");

-- CreateIndex
CREATE INDEX "bookings_transferred_from_booking_id_idx" ON "bookings"("transferred_from_booking_id");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_items_transferred_from_booking_id_idx" ON "order_items"("transferred_from_booking_id");

-- CreateIndex
CREATE INDEX "orders_transferred_from_booking_id_idx" ON "orders"("transferred_from_booking_id");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_transferred_from_booking_id_fkey" FOREIGN KEY ("transferred_from_booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
