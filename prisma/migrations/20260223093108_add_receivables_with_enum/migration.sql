-- CreateEnum
CREATE TYPE "ReceivableStatus" AS ENUM ('UNPAID', 'PAID');

-- CreateTable
CREATE TABLE "receivables" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "amount" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "transactionId" TEXT,

    CONSTRAINT "receivables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "receivables_userId_idx" ON "receivables"("userId");

-- CreateIndex
CREATE INDEX "receivables_status_idx" ON "receivables"("status");

-- CreateIndex
CREATE INDEX "receivables_userId_status_idx" ON "receivables"("userId", "status");

-- AddForeignKey
ALTER TABLE "receivables" ADD CONSTRAINT "receivables_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivables" ADD CONSTRAINT "receivables_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
