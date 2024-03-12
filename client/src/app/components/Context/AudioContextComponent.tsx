"use client";
import {createContext, useContext, useEffect, useState, useRef} from "react";

type context = {
  AudioContext : AudioContext | null,
  AudioBufferSourceNode: AudioBufferSourceNode | null,
  isPlaying: boolean,
  volume: number,
  currentTime: number,
  duration: number,
  musicMetaData: song | null,
  playSong: (song:song)=>void,
  pauseSong: ()=>void,
  changeVolume: (value:number)=>void,
  seekSong: (value:number)=>void,
  currentSongIndex: number,
  queue: {songID:string,isLiked:boolean}[],
  shuffleQueue: ()=>void,
  updateQueue:(queue:{songID:string,isLiked:boolean}[]) => void,
  nextSong : ()=> void,
  prevSong : ()=> void,
}

const Context = createContext<context|null>(null);

export const useAudioContext = ()=> useContext(Context);

export default function AudioContextComponent({
  children
}: {
  children: React.ReactNode;
}){
  const [audioContext,setAudioContext] = useState<AudioContext | null>(null);
  const audioBufferSourceNode = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const timeUpdateEvent = useRef<Event|null>(null)
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicMetaData, setMusicMetaData] = useState<song|null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeOffset, setTimeOffset] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(30);
  const [queue,setQueue] = useState<{songID:string, isLiked:boolean}[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);


  useEffect(()=>{
    let time = currentTime;

    if(isPlaying){
      let interval = setInterval(function(){
        if(time >= duration){
          clearInterval(interval);
        }
        setCurrentTime(time+=0.1);
      }, 100);

      return ()=>{
        clearInterval(interval);
      }
    }
  },[audioContext, timeOffset, isPlaying])

  useEffect(()=>{
    if(currentTime >= duration && queue&& queue.length > 0){
      endSong("next");
    }
  },[currentTime])

  

  const playSong = async (song:song)=>{
    if(audioContext){audioContext.close(); setTimeOffset(0); setCurrentTime(0); setIsPlaying(false);}
    setMusicMetaData(song);
    const audioCtx = new window.AudioContext();
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(volume/100, audioCtx.currentTime);
    gainNodeRef.current = gainNode;
    
    fetch(`/api/music/${song.songID}`,{
      headers:{
        api_key: process.env.SERVER_API_KEY as string,
      },
    })
    .then(res=>{
      
      return res.arrayBuffer()})
    .then(data=>{
          // console.log('streaming')
          return audioCtx.decodeAudioData(data)
      })
      .then(buffer=>{
          setAudioContext(audioCtx);
          audioBufferRef.current = buffer;
          playBuffer(buffer);
          setDuration(buffer.duration);
      })

      const playBuffer = (buffer: AudioBuffer) => {
        audioBufferSourceNode.current = audioCtx.createBufferSource();
        audioBufferSourceNode.current.buffer = buffer;
        audioBufferSourceNode.current
        .connect(gainNode)
        .connect(audioCtx.destination);
        audioBufferSourceNode.current.start();
        setIsPlaying(true);
      }
    
    
  }

  const endSong = (skip:string) => {
    console.log(currentSongIndex+2)
    const currentSong = currentSongIndex + 1;
    if(audioContext){audioContext.close(); setTimeOffset(0); setCurrentTime(0); setIsPlaying(false);}
    if(queue && queue.length > 0 && currentSongIndex <queue.length)
      
      if(skip === "next" && (currentSongIndex+1) < queue.length){
        
        fetch('/api/music/data/'+queue[currentSong].songID).then(res=>{
          if(res.status === 200){
            res.json().then(data=>{
              const date = new Date(Date.parse(data.dateAdded))
              const songData = {
                index: 0,
                liked: queue[currentSong].isLiked,
                songID: data.songID,
                title: data.title,
                album:data.album,
                artist:data.artist,
                genre:data.genre,
                duration:data.duration,
                track:data.track,
                dateAdded: date.toLocaleString('default', { month: 'short' })+ " " + date.toLocaleString('default', { day: 'numeric' })+", "+date.getFullYear(),
              }
              playSong(songData)
              if(currentSongIndex+1 < queue.length)
                setCurrentSongIndex(currentSongIndex+1);
              
            });
          }
        })
      }
      else if(skip==="prev"){
        fetch('/api/music/data/'+queue[currentSongIndex>0?currentSongIndex:0].songID).then(res=>{
          if(res.status === 200){
            res.json().then(data=>{
              const date = new Date(Date.parse(data.dateAdded))
              const songData = {
                index: 0,
                liked: queue[currentSongIndex].isLiked,
                songID: data.songID,
                title: data.title,
                album:data.album,
                artist:data.artist,
                genre:data.genre,
                duration:data.duration,
                track:data.track,
                dateAdded: date.toLocaleString('default', { month: 'short' })+ " " + date.toLocaleString('default', { day: 'numeric' })+", "+date.getFullYear(),
              }
              // console.log('playing next song:' + songData.title);
              // console.log('prev song:' + prevQueue[prevQueue.length - 1].songID);
              playSong(songData)
              if(currentSongIndex > 0)
              setCurrentSongIndex(currentSongIndex-1);
              
            });
          }
        })
      
      }
    
  }

  const pauseSong = async()=>{
    if(isPlaying && audioContext){
      await audioContext.suspend();
    }else{
      await audioContext?.resume();
    }
    setIsPlaying(!isPlaying);
  }

  const changeVolume = (value:number)=>{
    setVolume(value);
    if(gainNodeRef.current){
      gainNodeRef.current.gain.setValueAtTime(value/100, 0.1)
    }
  }

  const seekSong = (value:number)=>{
    if(value < 0) return;
    if(audioContext && duration && audioBufferRef.current && gainNodeRef.current){
      const seekTime = (value/100)*duration
      //console.log(value,seekTime, duration);
      if(audioBufferSourceNode.current){
        audioBufferSourceNode.current.stop();
      }
      audioBufferSourceNode.current = audioContext.createBufferSource();
      audioBufferSourceNode.current.buffer = audioBufferRef.current;
      audioBufferSourceNode.current
        .connect(gainNodeRef.current)
        .connect(audioContext.destination);
      audioBufferSourceNode.current.start(0,seekTime);
      setTimeOffset(seekTime);
      setCurrentTime(seekTime);
    } 
    
  }

  const updateQueue = (queue:{songID:string,isLiked:boolean}[]) => {
    setQueue(queue);
  }

  const shuffleQueue = ()=>{
    let array = queue;
    console.log(array);
    let currentIndex = array.length, randomIndex;
    while (currentIndex > 0) {
      
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
      console.log(currentIndex,randomIndex,array[currentIndex],array[randomIndex]);
    }
    console.log(array);
    setQueue(array);
  }

  const nextSong = ()=>{
    endSong("next");
  }

  const prevSong = ()=>{
    endSong("prev");
      
  }
  




  return <Context.Provider value={{AudioContext: audioContext,AudioBufferSourceNode: audioBufferSourceNode.current,isPlaying: isPlaying, volume: volume,musicMetaData: musicMetaData,currentTime: currentTime, duration: duration, playSong: playSong, pauseSong: pauseSong, changeVolume: changeVolume, seekSong,currentSongIndex,queue, shuffleQueue,updateQueue,nextSong,prevSong}}>
    {children}
  </Context.Provider>
}