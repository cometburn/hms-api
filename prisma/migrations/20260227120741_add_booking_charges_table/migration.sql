-- CreateTable
CREATE TABLE "booking_charges" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_charges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "booking_charges_booking_id_idx" ON "booking_charges"("booking_id");

-- AddForeignKey
ALTER TABLE "booking_charges" ADD CONSTRAINT "booking_charges_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_charges" ADD CONSTRAINT "booking_charges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
