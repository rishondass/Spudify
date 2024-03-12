import {useState, useEffect} from "react";
import Image from "next/image";
import { IoMdHeart } from "react-icons/io";

type props = {
  songID: string;
  isLiked: boolean;
  index: number;
}

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

const QueueListCard = ({index,songID, isLiked}:props) => {
  const [song,setSong] = useState<songInfo|null>();
  
  useEffect(()=>{
    fetch('/api/music/data/'+songID).then(res=>{
      if(res.status === 200){
        res.json().then(data=>{
          const date = new Date(Date.parse(data.dateAdded))
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
        });
      }
    })

  },[]);

  return (
    <div className="w-full flex hover:bg-white/20 px-4 py-1 rounded-md group">
      {index==1?<div className="pr-3 pt-3 text-green-500">{index}</div>:<div className="text-center pr-3 pt-3 text-white/60">{index}</div>}
      <div className="relative w-10 h-10 pt-1">
        <Image className="rounded-md" src={`/api/music/artwork/${song?.songID}`} alt="song_image" width={40} height={40}/>
      </div>
      <div className="flex flex-col w-[32rem] pl-2">
        {index==1?<span className="font-semibold text-green-500">{song?.title}</span>:<span className="font-semibold">{song?.title}</span>}
        <span className="text-white/60 group-hover:text-white">{song?.artist}</span>
      </div>
      <div className="grow pt-3 text-white/60 group-hover:text-white">{song?.album}</div>
      <div className="pr-10 pt-3">{isLiked&&<IoMdHeart size={20} className="text-green-400"/>}</div>
      <div className="pt-3 text-white/60 ">{song?.duration&&Math.floor(song?.duration/60)}:{song?.duration&&Math.floor(song?.duration%60).toString().padStart(2,"0")}</div>
    </div>
  )
}

export default QueueListCard