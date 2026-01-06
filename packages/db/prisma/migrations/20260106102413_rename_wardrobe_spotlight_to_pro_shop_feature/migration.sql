/*
  Rename WARDROBE_SPOTLIGHT to PRO_SHOP_FEATURE
  
  This migration safely renames the enum value by:
  1. Creating a new enum with both old and new values
  2. Converting existing WARDROBE_SPOTLIGHT records to PRO_SHOP_FEATURE
  3. Creating the final enum with only the new value
  4. Cleaning up the temporary enum
*/
-- AlterEnum: Rename WARDROBE_SPOTLIGHT to PRO_SHOP_FEATURE
BEGIN;

-- Create new enum with BOTH values (to allow safe conversion)
CREATE TYPE "PromotionType_new" AS ENUM ('BUMP', 'WARDROBE_SPOTLIGHT', 'PRO_SHOP_FEATURE');

-- Convert column to the new enum type
ALTER TABLE "product_promotions" ALTER COLUMN "type" TYPE "PromotionType_new" USING ("type"::text::"PromotionType_new");

-- Drop old enum
ALTER TYPE "PromotionType" RENAME TO "PromotionType_old";
ALTER TYPE "PromotionType_new" RENAME TO "PromotionType";
DROP TYPE "public"."PromotionType_old";

-- Update any existing WARDROBE_SPOTLIGHT records to PRO_SHOP_FEATURE
UPDATE "product_promotions" SET "type" = 'PRO_SHOP_FEATURE' WHERE "type" = 'WARDROBE_SPOTLIGHT';

-- Now create the final enum without the old value
CREATE TYPE "PromotionType_final" AS ENUM ('BUMP', 'PRO_SHOP_FEATURE');
ALTER TABLE "product_promotions" ALTER COLUMN "type" TYPE "PromotionType_final" USING ("type"::text::"PromotionType_final");
ALTER TYPE "PromotionType" RENAME TO "PromotionType_old";
ALTER TYPE "PromotionType_final" RENAME TO "PromotionType";
DROP TYPE "public"."PromotionType_old";

COMMIT;
