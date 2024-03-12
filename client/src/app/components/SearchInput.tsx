"use client"
import { BiSearch } from "react-icons/bi";
const SearchInput = () => {

  const search = async (e: React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.value.length >0){
      const res = await (await fetch("/api/music/search/"+e.target.value)).json();
    
      console.log(res);
    }
  }

  return (
    <div className="flex mx-auto gap-2 items-center rounded-lg bg-[#242525] px-2 py-3 text-white hover:outline outline-gray-800 w-60">
      <BiSearch/>
      <input type="text" placeholder="search" className="outline-none bg-inherit w-full" onChange={search}/>
    </div>
  )
}

export default SearchInput