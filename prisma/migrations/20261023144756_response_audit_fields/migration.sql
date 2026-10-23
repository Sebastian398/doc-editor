/*
  Warnings:

  - A unique constraint covering the columns `[roomId,fieldId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `response` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdById` VARCHAR(191) NULL,
    ADD COLUMN `createdByName` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Response_roomId_fieldId_key` ON `Response`(`roomId`, `fieldId`);

-- AddForeignKey
ALTER TABLE `Response` ADD CONSTRAINT `Response_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
