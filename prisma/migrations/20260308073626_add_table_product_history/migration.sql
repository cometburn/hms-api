-- CreateTable
CREATE TABLE "product_history" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "changed_by" INTEGER NOT NULL,
    "field" TEXT NOT NULL,
    "old_value" TEXT NOT NULL,
    "new_value" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_history" ADD CONSTRAINT "product_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_history" ADD CONSTRAINT "product_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
