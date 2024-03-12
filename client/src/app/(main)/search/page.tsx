
import getMusicData from "@/app/lib/getMusicData";
import SearchComponent from "@/app/components/Search";
import LinkedSongsButton from "@/app/components/LikedSongsButton"

export default async function Search(){
  const musicData:song[] = await getMusicData();

  return <>
  <div>
    <SearchComponent musicData={musicData}/>
  </div>

</>
}



