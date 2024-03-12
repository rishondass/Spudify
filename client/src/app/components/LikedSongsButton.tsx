"use client"
import Image from "next/image";
import {useRouter} from "next/navigation";
const LikedSongsButton = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col overflow-y-auto pt-4">
            <button className="inline-flex items-center gap-3 font-semibold bg-highlightBg px-2 py-3 rounded-md" onClick={()=>router.push('/collection/tracks')}>
              <Image src="/images/Liked-Songs.svg" width="48" height= "48" alt="liked-songs-img" className="rounded"/>
              Liked Songs
            </button>
    </div>
  )
}

export default LikedSongsButton