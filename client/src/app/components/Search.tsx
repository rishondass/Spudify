"use client";
import SongCard from "@/app/components/SongCard";
import SearchInput from "./SearchInput";
import {auth} from "@/app/api/auth/[...nextauth]/auth";
import {useLikedSongsContext} from "@/app/components/Context/LikedSongsContext";
type Props = {
  musicData : song[],
}



export default function Search({musicData}:Props){
  
  const likedSongsContext = useLikedSongsContext();
  const likedSongs = likedSongsContext?.likedSongs;
  return <div>
    <SearchInput/>
    <div className="overflow-y-auto">
      {musicData.map((song:song,index:number)=>{
        return <SongCard key={song.songID} {...song} index={index} liked={likedSongs?.some(likedSong => likedSong.songID == song.songID) || false}/>
      })}
    </div>
  </div>
}



