-- CreateTable
CREATE TABLE `RoomSigner` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `signed` BOOLEAN NOT NULL DEFAULT false,
    `signedAt` DATETIME(3) NULL,

    UNIQUE INDEX `RoomSigner_roomId_position_key`(`roomId`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RoomSigner` ADD CONSTRAINT `RoomSigner_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomSigner` ADD CONSTRAINT `RoomSigner_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
