-- CreateTable
CREATE TABLE "song" (
    "songID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "audioURL" TEXT NOT NULL,
    "userID" TEXT,

    CONSTRAINT "song_pkey" PRIMARY KEY ("songID")
);

-- AddForeignKey
ALTER TABLE "song" ADD CONSTRAINT "song_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
