-- AlterTable
ALTER TABLE "users" ADD COLUMN     "pushTokens" TEXT[] DEFAULT ARRAY[]::TEXT[];
