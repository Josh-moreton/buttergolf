-- AlterTable
ALTER TABLE "products" ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestId" TEXT;

-- CreateIndex
CREATE INDEX "products_requestId_idx" ON "products"("requestId");
