/*
  Warnings:

  - You are about to drop the column `email` on the `pessoas` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `pessoas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `destinatarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `entregadores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `destinatarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `destinatarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `entregadores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `entregadores` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `pessoas_email_key` ON `pessoas`;

-- AlterTable
ALTER TABLE `destinatarios` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `senha` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `entregadores` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `senha` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `pessoas` DROP COLUMN `email`,
    DROP COLUMN `senha`;

-- CreateIndex
CREATE UNIQUE INDEX `destinatarios_email_key` ON `destinatarios`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `entregadores_email_key` ON `entregadores`(`email`);
