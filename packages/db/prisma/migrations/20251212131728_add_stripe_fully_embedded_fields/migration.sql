-- AlterTable
ALTER TABLE "users" ADD COLUMN     "stripeAccountType" TEXT DEFAULT 'express',
ADD COLUMN     "stripeRequirementsDeadline" TIMESTAMP(3),
ADD COLUMN     "stripeRequirementsDue" JSONB;
