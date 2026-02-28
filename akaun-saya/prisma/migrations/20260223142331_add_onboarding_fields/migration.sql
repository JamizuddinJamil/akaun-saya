-- AlterTable
ALTER TABLE "users" ADD COLUMN     "companyLogo" TEXT,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
