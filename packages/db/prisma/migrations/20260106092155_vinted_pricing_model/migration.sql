-- CreateEnum
CREATE TYPE "PaymentHoldStatus" AS ENUM ('HELD', 'RELEASED', 'DISPUTED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('BUMP', 'WARDROBE_SPOTLIGHT');

-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "autoReleaseAt" TIMESTAMP(3),
ADD COLUMN     "buyerConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "buyerProtectionFee" DOUBLE PRECISION,
ADD COLUMN     "paymentHeldAt" TIMESTAMP(3),
ADD COLUMN     "paymentHoldStatus" "PaymentHoldStatus" NOT NULL DEFAULT 'HELD',
ADD COLUMN     "paymentReleasedAt" TIMESTAMP(3),
ADD COLUMN     "stripeChargeId" TEXT;

-- CreateTable
CREATE TABLE "product_promotions" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PromotionType" NOT NULL,
    "status" "PromotionStatus" NOT NULL DEFAULT 'PENDING',
    "stripePaymentId" TEXT,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_promotions_productId_idx" ON "product_promotions"("productId");

-- CreateIndex
CREATE INDEX "product_promotions_userId_idx" ON "product_promotions"("userId");

-- CreateIndex
CREATE INDEX "product_promotions_status_idx" ON "product_promotions"("status");

-- CreateIndex
CREATE INDEX "product_promotions_expiresAt_idx" ON "product_promotions"("expiresAt");

-- CreateIndex
CREATE INDEX "orders_paymentHoldStatus_idx" ON "orders"("paymentHoldStatus");

-- CreateIndex
CREATE INDEX "orders_autoReleaseAt_idx" ON "orders"("autoReleaseAt");

-- AddForeignKey
ALTER TABLE "product_promotions" ADD CONSTRAINT "product_promotions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_promotions" ADD CONSTRAINT "product_promotions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
