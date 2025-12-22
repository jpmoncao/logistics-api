/*
  Warnings:

  - Added the required column `senha` to the `pessoas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pessoas` ADD COLUMN `senha` VARCHAR(191) NOT NULL;
