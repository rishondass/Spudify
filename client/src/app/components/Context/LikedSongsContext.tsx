"use client";
import {createContext, useContext, useEffect, useState, useRef} from "react";
import {useSession} from "next-auth/react";
type context = {
  likedSongs: likedSongs | null | undefined;
  toggleLike: (id:string, liked:boolean)=>void;
  updateLikedSong : (likedSongs:likedSongs)=>void;
}
const Context = createContext<context|null>(null);

export const useLikedSongsContext = () => useContext(Context);

const LikedSongsContext = ({children}:{children:React.ReactNode}) => {
  const [likedSongs, setLikedSongs] = useState<likedSongs|[]>([]);
  const {data:session} = useSession();
  useEffect(()=>{
    if(session?.user){
      setLikedSongs(session.user.data?.likedSongs as likedSongs)
    }
  },[]);

  const addLikedSong = async (id:string)=>{

    const res = await fetch('/api/music/like',{
      method: "POST",
      body: JSON.stringify({userID: session?.user.data?.id, songID:id, type:"add"}),
    });
    if(res.status === 200){
      setLikedSongs((prev)=>{
        return [{songID:id,dateAdded:new Date(Date.now()).toString()},...prev]
      })
    }else{
      console.log(`can't add song!`);;
    }
  }

  const removeLikedSong = async (id:string)=>{
    const res = await fetch('/api/music/like',{
      method: "POST",
      body: JSON.stringify({userID: session?.user.data?.id, songID:id, type:"remove"}),
    });
    if(res.status === 200){
      setLikedSongs(likedSongs.filter(s=>s.songID !== id));
    }else{
      console.log(`can't remove song!`);;
    }
  }

  const toggleLike = (id:string, liked:boolean)=>{
    if(liked){
      removeLikedSong(id);
    }else{
      addLikedSong(id);
    }
  }

  const updateLikedSong = (likedSongs:likedSongs)=>{
    setLikedSongs(likedSongs);
  }
  

  return (
    <Context.Provider value={{likedSongs,toggleLike,updateLikedSong}}>
      {children}
    </Context.Provider>
  )
}

export default LikedSongsContext