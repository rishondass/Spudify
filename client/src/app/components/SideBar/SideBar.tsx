"use client";

import Box from './Box';
import { GoHomeFill } from "react-icons/go";
import { GoHome } from "react-icons/go";
import { BiSearch } from "react-icons/bi";
import { BiSolidSearch } from "react-icons/bi";
import { usePathname } from 'next/navigation';
import { BiLibrary } from "react-icons/bi";
import {useMemo} from "react";
import Image from "next/image";
import SideBarItem from './SideBarItem';
import SongInfo from "../Player/SongInfo"
import AddModal from "./AddModal"
import Link from 'next/link'
type Props = {
  children: React.ReactNode;
  className?: string;
}


const SideBar = ({children,className} : Props) => {
  const path = usePathname();
  const routes = useMemo(()=>[
    {
      label: "Home",
      icon: path === "/"? GoHomeFill : GoHome,
      href: "/",
      active: path === "/"? true : false
    },
    {
      label: "Search",
      icon: path === "/search"? BiSolidSearch : BiSearch,
      href: "/search",
      active: path === "/search"? true : false
    }
  ],[path])

  return <div className={className}>
    <div className="grid grid-cols-2 mainLayout p-2 gap-2 h-full">
      <nav className="w-[100px] md:w-[420px] flex flex-col gap-2">
        <Box>
          {routes.map(route=>{
            return <SideBarItem key={route.label} {...route}/>
          })}
        </Box>
        <Box className="h-full">
          <div className="flex justify-between items-center">
            <div className="font-bold inline-flex items-center just gap-3 text-white/60 transition hover:text-white/100">
              <BiLibrary size="30"/>
              <span className="text-lg">Your Library</span>
            </div>
            <AddModal/>
          </div>
          {/* Logic for playlists */}
          <div className="flex flex-col overflow-y-auto pt-4">
            {/* PlayList Components Go Here */}
            <Link href="/collection/tracks" className="inline-flex items-center gap-3 font-semibold hover:bg-highlightBg px-2 py-3 rounded-md">
              <Image src="/images/Liked-Songs.svg" width="48" height= "48" alt="liked-songs-img" className="rounded"/>
              Liked Songs
            </Link>
          </div>
        </Box>
      </nav>
      {children}
      <SongInfo/>

      
    </div>
    
  </div>
}

export default SideBar