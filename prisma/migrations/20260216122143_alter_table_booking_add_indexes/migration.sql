-- CreateIndex
CREATE INDEX "bookings_end_datetime_idx" ON "bookings"("end_datetime");

-- CreateIndex
CREATE INDEX "bookings_hotel_id_status_idx" ON "bookings"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "bookings_status_end_datetime_idx" ON "bookings"("status", "end_datetime");
