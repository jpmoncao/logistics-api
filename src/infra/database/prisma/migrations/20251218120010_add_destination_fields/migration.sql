/*
  Warnings:

  - Added the required column `latitude_destino` to the `entregas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude_destino` to the `entregas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `entregas` ADD COLUMN `latitude_destino` DOUBLE NOT NULL,
    ADD COLUMN `longitude_destino` DOUBLE NOT NULL;
