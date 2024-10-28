/*
  Warnings:

  - A unique constraint covering the columns `[template_id,user_id]` on the table `Form` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Form_template_id_user_id_key" ON "Form"("template_id", "user_id");
