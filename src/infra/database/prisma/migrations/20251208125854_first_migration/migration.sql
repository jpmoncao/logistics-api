-- CreateTable
CREATE TABLE `entregas` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDENTE', 'CAMINHO', 'ENTREGUE') NOT NULL DEFAULT 'PENDENTE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movimentacoes` (
    `id` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `entregaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `movimentacoes` ADD CONSTRAINT `movimentacoes_entregaId_fkey` FOREIGN KEY (`entregaId`) REFERENCES `entregas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
