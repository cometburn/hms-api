-- AlterTable
ALTER TABLE "product_movements" ADD COLUMN     "booking_id" INTEGER,
ADD COLUMN     "order_id" INTEGER,
ADD COLUMN     "order_item_id" INTEGER;

-- AddForeignKey
ALTER TABLE "product_movements" ADD CONSTRAINT "product_movements_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_movements" ADD CONSTRAINT "product_movements_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_movements" ADD CONSTRAINT "product_movements_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
