/*
  Warnings:

  - You are about to alter the column `answer_value` on the `Answer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(510)`.

*/
-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "answer_value" SET DATA TYPE VARCHAR(510);
