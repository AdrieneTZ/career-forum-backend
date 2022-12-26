-- AlterTable
ALTER TABLE `User` ADD COLUMN `isAdmin` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `isDeleted` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `isSuspended` BOOLEAN NULL DEFAULT false;
