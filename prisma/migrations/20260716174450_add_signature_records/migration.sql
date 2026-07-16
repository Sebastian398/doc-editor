-- AlterTable
ALTER TABLE `completioncertificate` ADD COLUMN `signerToken` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `SignatureRecord` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `signerName` VARCHAR(191) NULL,
    `signerEmail` VARCHAR(191) NULL,
    `signerToken` VARCHAR(191) NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` LONGTEXT NULL,
    `signedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SignatureRecord` ADD CONSTRAINT `SignatureRecord_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
