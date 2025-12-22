/*
  Warnings:

  - You are about to drop the column `cpf` on the `entregadores` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `entregadores` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `entregadores` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `entregadores` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `entregadores` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pessoaId]` on the table `entregadores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pessoaId` to the `entregadores` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `entregadores_cpf_key` ON `entregadores`;

-- DropIndex
DROP INDEX `entregadores_email_key` ON `entregadores`;

-- DropIndex
DROP INDEX `entregadores_telefone_key` ON `entregadores`;

-- AlterTable
ALTER TABLE `entregadores` DROP COLUMN `cpf`,
    DROP COLUMN `email`,
    DROP COLUMN `nome`,
    DROP COLUMN `senha`,
    DROP COLUMN `telefone`,
    ADD COLUMN `pessoaId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `entregas` ADD COLUMN `destinatarioId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `pessoas` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pessoas_cpf_key`(`cpf`),
    UNIQUE INDEX `pessoas_email_key`(`email`),
    UNIQUE INDEX `pessoas_telefone_key`(`telefone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `destinatarios` (
    `id` VARCHAR(191) NOT NULL,
    `pessoaId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `destinatarios_pessoaId_key`(`pessoaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `entregadores_pessoaId_key` ON `entregadores`(`pessoaId`);

-- AddForeignKey
ALTER TABLE `entregas` ADD CONSTRAINT `entregas_destinatarioId_fkey` FOREIGN KEY (`destinatarioId`) REFERENCES `destinatarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entregadores` ADD CONSTRAINT `entregadores_pessoaId_fkey` FOREIGN KEY (`pessoaId`) REFERENCES `pessoas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `destinatarios` ADD CONSTRAINT `destinatarios_pessoaId_fkey` FOREIGN KEY (`pessoaId`) REFERENCES `pessoas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
