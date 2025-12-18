-- AlterTable
ALTER TABLE `entregas` ADD COLUMN `entregadorId` VARCHAR(191) NULL,
    ADD COLUMN `latitude_atual` DOUBLE NULL,
    ADD COLUMN `longitude_atual` DOUBLE NULL;

-- CreateTable
CREATE TABLE `entregadores` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `entregadores_cpf_key`(`cpf`),
    UNIQUE INDEX `entregadores_email_key`(`email`),
    UNIQUE INDEX `entregadores_telefone_key`(`telefone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `entregas` ADD CONSTRAINT `entregas_entregadorId_fkey` FOREIGN KEY (`entregadorId`) REFERENCES `entregadores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
