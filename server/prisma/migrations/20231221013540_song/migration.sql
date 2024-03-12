/*
  Warnings:

  - Added the required column `duration` to the `song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "song" ADD COLUMN     "album" TEXT,
ADD COLUMN     "duration" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "track" TEXT;
