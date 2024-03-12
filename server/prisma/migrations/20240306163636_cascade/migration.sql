-- DropForeignKey
ALTER TABLE "likedSongs" DROP CONSTRAINT "likedSongs_songID_fkey";

-- DropForeignKey
ALTER TABLE "likedSongs" DROP CONSTRAINT "likedSongs_userID_fkey";

-- DropForeignKey
ALTER TABLE "song" DROP CONSTRAINT "song_userID_fkey";

-- AddForeignKey
ALTER TABLE "song" ADD CONSTRAINT "song_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likedSongs" ADD CONSTRAINT "likedSongs_songID_fkey" FOREIGN KEY ("songID") REFERENCES "song"("songID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likedSongs" ADD CONSTRAINT "likedSongs_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
