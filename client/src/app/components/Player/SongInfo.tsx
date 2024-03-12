import Image from "next/image";
import {useAudioContext} from "@/app/components/Context/AudioContextComponent";
import {useState, useEffect, useMemo} from 'react';
import {IconType} from 'react-icons';
import { FaCirclePlay } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";
import { FaPause } from "react-icons/fa";
import { IoShuffle, IoVolumeMute } from "react-icons/io5";
import { IoVolumeMedium } from "react-icons/io5";
import { IoVolumeLow } from "react-icons/io5";
import { IoVolumeHigh } from "react-icons/io5";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { HiOutlineQueueList } from "react-icons/hi2";
import { HiMiniQueueList } from "react-icons/hi2";
import { FaForwardStep } from "react-icons/fa6";
import { FaBackwardStep } from "react-icons/fa6";



import { usePathname,useRouter } from 'next/navigation';

import SeekBar from "./SeekBar";
import { useLikedSongsContext } from "../Context/LikedSongsContext";

const SongInfo = () => {
  const [durationToggle,setDurationToggle] = useState(false);
  const [volumeIcon, setVolumeIcon] = useState(<IoVolumeMute size={20}/>);
  const [isMuted, setIsMuted] = useState(false);
  const pauseSong = useAudioContext()?.pauseSong;
  const isPlaying = useAudioContext()?.isPlaying;
  const shuffleQueue = useAudioContext()?.shuffleQueue;
  const nextSong = useAudioContext()?.nextSong;
  const prevSong = useAudioContext()?.prevSong;
  const musicMetaData = useAudioContext()?.musicMetaData;
  let volume = useAudioContext()?.volume || 0;
  const duration = useAudioContext()?.duration || 0;
  const currentTime = useAudioContext()?.currentTime || 0;
  const changeVolume = useAudioContext()?.changeVolume;
  const seekSong = useAudioContext()?.seekSong;
  const [isLiked, setIsLiked] = useState(false);
  const [muteVolume, setMuteVolume] = useState(volume || 0)
  const likedSongsContext = useLikedSongsContext();

  const path = usePathname();
  const router = useRouter();
  useEffect(()=>{
    if(volume <=  0){
      setVolumeIcon(<IoVolumeMute size={20}/>);
    }
    else if(volume >= 1 && volume < 30){
      setVolumeIcon(<IoVolumeLow size={20}/>);
    }
    else if(volume >= 30 && volume < 70){
      setVolumeIcon(<IoVolumeMedium size={20}/>);
    }
    else{
      setVolumeIcon(<IoVolumeHigh size={20}/>)
    }
    if(volume > 0) {
      setMuteVolume(volume);
      if(isMuted){
        setIsMuted(!isMuted);
      }
    }
    
    
    
  },[volume]);

  useEffect(()=>{
    if(musicMetaData)
      setIsLiked(musicMetaData.liked);
  },[musicMetaData]);

  useEffect(()=>{
    if(likedSongsContext?.likedSongs && musicMetaData?.songID){
      const updateLiked = likedSongsContext.likedSongs.some(s=>{
        if(s.songID == musicMetaData.songID){
          return true;
        }
      });
      updateLiked?setIsLiked(true):setIsLiked(false);
    }
    
  },[likedSongsContext])

  const handelMute = ()=>{
    setIsMuted(!isMuted)
    if(!isMuted){
      changeVolume&&changeVolume(0);
    }else{
      changeVolume&&changeVolume(muteVolume)
    }
    
    
  }


  return (
    <div className="col-span-2 w-full grid grid-cols-3 items-center">
      <div id="songData" className="p-2 flex items-center">
        {musicMetaData&&
        <Image src={`/api/music/artwork/${musicMetaData.songID}`} alt="current-song-image" width="65" height="65" className="rounded-md"/>}
        <div className="flex flex-col pl-3 ">
          <span className="">
            {musicMetaData&&musicMetaData.title}
          </span>
          <span className="text-xs text-white/75">
            {musicMetaData&&musicMetaData.artist}
          </span>
        </div>
        {musicMetaData&&
          <button className="px-3" onClick={(e)=>{musicMetaData?.songID&&likedSongsContext?.toggleLike(musicMetaData.songID,isLiked)}}>
            {isLiked?(<IoMdHeart size={20} className="text-green-400"/>):(<IoMdHeartEmpty size={20}/>)}
          </button>
        }
        
        
      </div>
      <div id="playerControls" className="grow w-full flex flex-col justify-center">
        <div className="flex justify-center items-center gap-6">
          <IoShuffle className="text-white/40 hover:text-white cursor-pointer" size={23} onClick={()=>{shuffleQueue&&shuffleQueue()}}/>
          <FaBackwardStep size={27} className="text-white/40 hover:text-white cursor-pointer" onClick={()=>{prevSong&&prevSong()}}/>
          <button className="" onClick={()=>{pauseSong&&pauseSong()}}>
            {isPlaying?<FaCirclePause size={32}/>:<FaCirclePlay size={32}/>}
          </button>
          <FaForwardStep size={27} className="text-white/40 hover:text-white cursor-pointer" onClick={()=>{nextSong&&nextSong()}}/>
        </div>
        <div className="w-full py-3 flex items-center">
          <span className="px-2 text-xs">{Math.floor(currentTime/60)}:{Math.floor(currentTime%60).toString().padStart(2,"0")}</span>
          <div className="rounded-md w-full group">
            <SeekBar className="bg-white/20 w-full rounded-md h-1 transition-all" trackClass="w-full h-1" value={currentTime} duration={duration} onUpdate={seekSong}/>
            <span></span>
          </div>
          <span className="px-2 text-xs" onClick={()=>{setDurationToggle(!durationToggle)}}>
          {!durationToggle?
            (Math.floor(duration/60)+":"+Math.floor(duration%60).toString().padStart(2,"0")):
            (Math.floor((duration-currentTime+0.2)/60)+":"+Math.floor((duration-currentTime+0.2)%60).toString().padStart(2,"0"))
          }
          </span>
        </div>
      </div>
      
      <div id="userControls" className="rounded-lg py-3 flex items-center justify-end w-full pr-10 h-full">
        {/* Queue Implementation 
        <div id="queueControls" className="pr-5">
          {path==="/queue"?<HiMiniQueueList className="text-green-500" size={20} onClick={() => {router.back();}}/>
          :
          <HiOutlineQueueList size={20} onClick={() => {router.push('/queue');}}/>}
        </div> */}
        <div id="volumeControls" className="flex items-center">
          <div className="pr-2" onClick={handelMute}>
            {volumeIcon}
          </div>
          <SeekBar className="h-full flex items-center" trackClass="w-32 h-1" onChange={changeVolume} value={volume} progressClass={volume==0?"hidden":"block"} />
        </div>
        
      </div>
      
    </div>
  )
}

export default SongInfo;

