import SideBar from "@/app/components/SideBar/SideBar";
import AudioContextComponent from "@/app/components/Context/AudioContextComponent";
import LikedSongsContext from "@/app/components/Context/LikedSongsContext";
import {useState} from "react";
export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>
    <AudioContextComponent>
    <LikedSongsContext>
      <SideBar className="h-full">
        <div className="rounded-md overflow-y-auto">
              {children}
        </div>
        
      </SideBar>
      </LikedSongsContext>
    </AudioContextComponent>
    
  </>;
}