/*
  Warnings:

  - You are about to drop the column `account` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isSuspended` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Made the column `createdAt` on table `answer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `question` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `approvalStatus` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `answer` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `question` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` DROP COLUMN `account`,
    DROP COLUMN `isAdmin`,
    DROP COLUMN `isDeleted`,
    DROP COLUMN `isSuspended`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `permissionRole` ENUM('user', 'admin', 'developer') NOT NULL DEFAULT 'user',
    ADD COLUMN `suspendedAt` DATETIME(3) NULL,
    MODIFY `role` ENUM('student', 'graduate', 'TA') NOT NULL DEFAULT 'student',
    MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `approvalStatus` ENUM('reviewing', 'approved', 'rejected') NOT NULL DEFAULT 'reviewing';

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);
