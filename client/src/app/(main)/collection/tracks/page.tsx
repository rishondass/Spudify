"use client";
import Image from "next/image";
import Nav from "@/app/components/SideBar/Nav";
import { useSession } from "next-auth/react";

import { useState, useEffect, cache, Suspense } from "react";
import { useLikedSongsContext } from "@/app/components/Context/LikedSongsContext";
import LikedSongsTable from "@/app/components/LikedSongsTable";

const LikedSongs = () => {
  const { data: session } = useSession();
  const likedSongs = useLikedSongsContext()?.likedSongs;

  return (
    <div className="bg-gradient-to-b from-[#523BA0] from-[1%] via-backgroundBg via-95% h-full flex flex-col">
      <Nav>
        <div className="flex px-6">
          <div className="xl:min-w-[232px] xl:min-h-[232px] min-w-[128px] min-h-[128px] rounded-lg relative drop-shadow-2xl">
            <Image
              alt="liked-songs logo"
              src="/images/Liked-Songs.svg"
              fill
              className="rounded-lg"
            />
          </div>

          <div className="p-2 px-3 w-full">
            <div className="flex flex-col h-full">
              <div className="flex items-end h-full grow pb-6">
                <div>
                  <div>Playlist</div>
                  <div className="xl:text-7xl text-4xl font-extrabold">
                    Liked Songs
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Image
                  alt="profile_image"
                  src={session?.user.image || ""}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <div>
                  {session?.user?.data?.userName} •{" "}
                  {session?.user?.data?.likedSongs.length} songs
                </div>
              </div>
            </div>
          </div>
        </div>
      </Nav>
      <div className="bg-black/30 mt-10 grow p-2">
        <div className="py-10"></div>
        <LikedSongsTable songs={likedSongs} />
      </div>
    </div>
  );
};

export default LikedSongs;
