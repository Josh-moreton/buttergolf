-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "country" SET DEFAULT 'GB';
