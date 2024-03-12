-- CreateTable
CREATE TABLE "likedSongs" (
    "songID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "likedSongs_pkey" PRIMARY KEY ("songID","userID")
);

-- AddForeignKey
ALTER TABLE "likedSongs" ADD CONSTRAINT "likedSongs_songID_fkey" FOREIGN KEY ("songID") REFERENCES "song"("songID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likedSongs" ADD CONSTRAINT "likedSongs_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
