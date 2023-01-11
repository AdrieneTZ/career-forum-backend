/*
  Warnings:

  - Made the column `isAdmin` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isDeleted` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isSuspended` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `isSuspended` BOOLEAN NOT NULL DEFAULT false;
