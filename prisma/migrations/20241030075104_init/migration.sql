/*
  Warnings:

  - A unique constraint covering the columns `[bankAccountNumber]` on the table `BankAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_bankAccountNumber_key" ON "BankAccount"("bankAccountNumber");
