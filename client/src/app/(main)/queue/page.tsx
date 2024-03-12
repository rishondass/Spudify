'use client';
import Nav from "@/app/components/SideBar/Nav";
import {useAudioContext} from "@/app/components/Context/AudioContextComponent";
import QueueListCard from "@/app/components/Queue/QueueListCard";
const Queue = () => {
  const queue = useAudioContext()?.queue;
  const currentSongIndex  = useAudioContext()?.currentSongIndex;
  return (
    <Nav>
      <div className="text-2xl font-bold">Queue</div>
      <div className="text-lg text-white/80 pb-2">Now Playing</div>
      {queue&&queue[currentSongIndex||0]&&<QueueListCard key={queue&&queue[currentSongIndex||0].songID} index={1} songID={queue&&queue[currentSongIndex||0].songID} isLiked={queue&&queue[currentSongIndex||0].isLiked || false}/>}
      <div className="text-lg text-white/80 pt-10 pb-2">Next up</div>
      {queue?.map((song,index)=>{
        if(index !== 0 && (index < (queue.length-(currentSongIndex||0)))) {
          return <QueueListCard key={(currentSongIndex||0)+index} index={(currentSongIndex||0)==0?(currentSongIndex||0)+index+1:(currentSongIndex||0)+index-1} songID={song.songID} isLiked={song.isLiked}/>
        }
      })}
    </Nav>
    
  )
}

export default Queue