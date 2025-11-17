/*
  Warnings:

  - You are about to drop the column `brand` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ClubKind" AS ENUM ('DRIVER', 'FAIRWAY_WOOD', 'HYBRID', 'IRON_SET', 'WEDGE', 'PUTTER', 'BALL', 'BAG', 'APPAREL', 'ACCESSORY', 'OTHER');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "brand",
ADD COLUMN     "brandId" TEXT;

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_models" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "ClubKind" NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "club_models_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE INDEX "club_models_brandId_idx" ON "club_models"("brandId");

-- CreateIndex
CREATE INDEX "club_models_isVerified_idx" ON "club_models"("isVerified");

-- CreateIndex
CREATE INDEX "club_models_usageCount_idx" ON "club_models"("usageCount");

-- CreateIndex
CREATE UNIQUE INDEX "club_models_brandId_name_kind_key" ON "club_models"("brandId", "name", "kind");

-- CreateIndex
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

-- AddForeignKey
ALTER TABLE "club_models" ADD CONSTRAINT "club_models_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;
