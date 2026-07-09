/*
  Warnings:

  - You are about to drop the `flowdocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `flowdocument` DROP FOREIGN KEY `FlowDocument_documentId_fkey`;

-- DropForeignKey
ALTER TABLE `flowdocument` DROP FOREIGN KEY `FlowDocument_flowId_fkey`;

-- DropTable
DROP TABLE `flowdocument`;

-- CreateTable
CREATE TABLE `FlowRoomItem` (
    `id` VARCHAR(191) NOT NULL,
    `flowId` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FlowRoomItem_flowId_roomId_key`(`flowId`, `roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FlowRoomItem` ADD CONSTRAINT `FlowRoomItem_flowId_fkey` FOREIGN KEY (`flowId`) REFERENCES `Flow`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlowRoomItem` ADD CONSTRAINT `FlowRoomItem_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
