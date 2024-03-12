"use client";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { clsx } from "clsx";
import {useRouter} from "next/navigation";

import { useAudioContext } from "@/app/components/Context/AudioContextComponent";
import { useLikedSongsContext } from "@/app/components/Context/LikedSongsContext";
import { IoClose } from "react-icons/io5";

import { useSession } from "next-auth/react";

const SongCard = ({
  index,
  songID,
  title,
  album,
  artist,
  genre,
  duration,
  track,
  liked,
  userID,
}: song) => {
  const url = `/api/music/artwork/${songID}`;
  const playSong = useAudioContext()?.playSong;
  const Icon = liked ? IoMdHeart : IoMdHeartEmpty;
  const likedSongsContext = useLikedSongsContext();
  const router = useRouter();
  const {data:session} = useSession();
  console.log()

  const handleDelete = async (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
    e.stopPropagation();
    const res = await fetch('/api/music',{
      method: 'DELETE',
      body: JSON.stringify(songID),
    });
    if(res.status === 200){
      const newArr:likedSongs = likedSongsContext?.likedSongs?.filter(s=>s.songID !== songID) || [];
      likedSongsContext?.updateLikedSong(newArr);
      router.refresh();
    }else{
      console.log(res.status)
    }

  }

  return (
    <div className="bg-componentBg flex flex-col items-center justify-center rounded-lg py-2 w-[160px] float-left m-3">
      <div className="relative h-[150px] w-[150px]">
        <div className="static">
          <Image
            src={url}
            alt="song_pic"
            width={150}
            height={150}
            className="absolute top-0 left-0 rounded-md"
          />
          <div
            className="hover:bg-black/50 w-full h-full absolute top-0 left-0 cursor-pointer group"
            onClick={() => {
              playSong &&
                playSong({
                  index,
                  songID,
                  title,
                  album,
                  artist,
                  genre,
                  duration,
                  track,
                  liked,
                });
            }}
          >
            {session?.user.data?.id==userID&&
              <div onClick={handleDelete}>
                <IoClose size={32} className="cursor-pointer ml-3 text-white absolute top-1 left-[68%] bg-black/30 rounded-md hover:text-red-400 group-hover:visible invisible" />
              </div>
            }
            
            
            <button className="absolute top-[40%] left-[40%] z-10 group-hover:visible invisible ">
              <FaPlay size={40} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center">
        <div className="w-full p-2">
          <div className="font-bold overflow-hidden h-5">{title}</div>
          <div className="text-sm overflow-hidden h-5">{artist}</div>
        </div>
        <button
          className={clsx("pr-2", liked && "text-green-400")}
          onClick={(e) => {
            likedSongsContext?.toggleLike(songID, liked);
          }}
        >
          <Icon size={26} />
        </button>
      </div>
    </div>
  );
};

export default SongCard;
