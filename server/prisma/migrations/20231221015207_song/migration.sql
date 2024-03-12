/*
  Warnings:

  - Added the required column `track` to the `song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "song" DROP COLUMN "track",
ADD COLUMN     "track" INTEGER NOT NULL;
