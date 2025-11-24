-- AlterTable
ALTER TABLE "offers" ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "offers_expiresAt_idx" ON "offers"("expiresAt");
