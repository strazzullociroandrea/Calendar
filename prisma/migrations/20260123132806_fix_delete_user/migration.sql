-- DropForeignKey
ALTER TABLE `group` DROP FOREIGN KEY `group_ownerId_fkey`;

-- DropIndex
DROP INDEX `group_ownerId_fkey` ON `group`;

-- AddForeignKey
ALTER TABLE `group` ADD CONSTRAINT `group_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
