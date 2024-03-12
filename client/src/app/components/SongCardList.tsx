import Image from "next/image";
import { Suspense, useEffect, useState } from 'react'
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import {useLikedSongsContext} from "./Context/LikedSongsContext";
import { IoMdHeart } from "react-icons/io";

type songInfo={
  songID:string,
  title: string,
  album:string,
  artist:string,
  genre:string,
  duration:number,
  track:number,
  dateAdded:string,
}
type props = {
  songID: string,
  dateAdded: string,
  index: number,
  handleClick: (index:number,song:songInfo|null) => void,
}


const SongCardList = ({index,songID,dateAdded,handleClick}:props) => {
  const [song,setSong] = useState<songInfo|null>();
  const likedSongsContext = useLikedSongsContext();


  useEffect(()=>{
    fetch('/api/music/data/'+songID).then(res=>{
      if(res.status === 200){
        res.json().then(data=>{
          if(data){
            const date = new Date(Date.parse(dateAdded))
            const songData = {
              songID: data.songID,
              title: data.title,
              album:data.album,
              artist:data.artist,
              genre:data.genre,
              duration:data.duration,
              track:data.track,
              dateAdded: date.toLocaleString('default', { month: 'short' })+ " " + date.toLocaleString('default', { day: 'numeric' })+", "+date.getFullYear(),
            }
            setSong(songData);
          }
          
        });
      }
    })

  },[]);

  

  return (
    <tr className="hover:bg-gray-300/20 rounded-md group h-14 align-middle" onDoubleClick={()=>{song&&handleClick(index,song)}}>
        <td className="rounded-l-md p-2 group-hover:hidden w-10">{++index}</td>
        <td className="rounded-l-md hidden group-hover:table-cell text-center pl-2 w-10"><FaPlay size={11} onClick={()=>{song&&handleClick(index,song)}}/></td>
        <td className="w-[28rem]">
          <Image className="rounded-md float-left" src={`/api/music/artwork/${song?.songID}`} alt="song_image" width={40} height={40}/>
          <div className="flex flex-col pl-1">
            <span className="h-5 overflow-hidden ">{song?.title}</span>
            <span className="text-sm text-white/50 group-hover:text-white h-5 overflow-hidden">{song?.artist}</span>
          </div>
        </td>
        <td className="text-white/50 group-hover:text-white">{song?.album}</td>
        <td className="text-white/50 h-14 md:hidden xl:table-cell">{song?.dateAdded}</td>
        <td className="text-center invisible hover:visible group-hover:visible">
          <button className="" onClick={(e)=>{likedSongsContext?.toggleLike(songID,true)}}>
              <IoMdHeart size={20} className="text-green-400"/>
          </button>
        </td>
        <td className="rounded-r-md text-white/50">{song?.duration&&Math.floor(song?.duration/60)}:{song?.duration&&Math.floor(song?.duration%60).toString().padStart(2,"0")}</td>
    </tr>
  )
}

export default SongCardList