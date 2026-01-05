-- AlterTable
ALTER TABLE "products" ADD COLUMN     "gripCondition" INTEGER DEFAULT 7,
ADD COLUMN     "headCondition" INTEGER DEFAULT 7,
ADD COLUMN     "headCoverIncluded" BOOLEAN DEFAULT false,
ADD COLUMN     "shaftCondition" INTEGER DEFAULT 7,
ADD COLUMN     "woodsSubcategory" TEXT;
