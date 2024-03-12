import React, { useEffect } from 'react'
import { LuClock3 } from "react-icons/lu";
import SongCardList from "@/app/components/SongCardList";
import {useAudioContext} from "@/app/components/Context/AudioContextComponent";

type props = {
  songs: likedSongs | null | undefined
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

const LikedSongsTable = ({songs}:props) => {

  const playSong = useAudioContext()?.playSong;
  const updateQueue = useAudioContext()?.updateQueue;

  const handleClick = (index:number,song:songInfo|null)=>{
    if(playSong && song && updateQueue){
      playSong({index:0,songID:song.songID,title:song.title,album:song.album,artist:song.artist,genre:song.genre,duration:song.duration,track:song.track,liked:true});
      if(songs){
        const newQueue:{songID:string,isLiked:boolean}[] = [];
        songs?.slice(index-1).map((song:{songID :string, dateAdded:string})=>{
          newQueue.push({songID:song.songID, isLiked:true});
        });
        updateQueue(newQueue)
      }
      
      
    }
  }

  return (
    <table className="w-full text-left ">
          <thead>
            <tr className="text-sm text-white/50 border-b border-white/10">
              <th scope="col" className="pb-3">
                #
              </th>
              <th scope="col" className="pr-36 pb-3 font-normal">
                Title
              </th>
              <th scope="col" className="pr-5 pb-3 font-normal">
                Album
              </th>
              <th scope="col" className="pb-3 font-normal md:hidden xl:block">
                Date added
              </th>
              <th scope="col" className="pb-3 font-normal">
              </th>
              <th scope="col" className="pb-3 font-normal text-center">
                <LuClock3/>
              </th>
            </tr>
          </thead>
          <tbody className="before:leading-4 before:block before:content-['\200C']">
            {songs?.map((song, index) => {
              return (
                <SongCardList
                  key={song.songID}
                  index={index}
                  songID={song.songID}
                  dateAdded={song.dateAdded}
                  handleClick={handleClick}
                />
              );
            })}
          </tbody>
        </table>
  )
}

export default LikedSongsTable