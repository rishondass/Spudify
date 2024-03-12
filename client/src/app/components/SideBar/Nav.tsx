"use client";
import {useState} from "react";
import { useRouter } from "next/navigation";
import {useSession, signOut} from "next-auth/react";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import Image from "next/image";
import { usePathname } from 'next/navigation';
const Nav = ({children}:{children:React.ReactNode}) => {
  const router = useRouter();
  const {data:session} = useSession();
  const path = usePathname();
  const picURL = session?.user?.image as string;

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <button
            className="bg-slate-950 rounded-full p-2 w-fit"
            onClick={() => {
              router.back();
            }}
          >
            <GrPrevious className="" size="18" />
          </button>
          <button
            className="bg-slate-950 rounded-full p-2 w-fit"
            onClick={() => {
              router.forward();
            }}
          >
            <GrNext className="" size="18" />
          </button>
        </div>
        <div>
          <button className="rounded-full p-2" onClick={()=>signOut()}>
            <Image src={picURL} alt="profile-pic" width={34} height={34} className="rounded-full"/>
          </button>
        </div>
        
      </div>
      <div>
        {children}
      </div>
    </>
  );
};

export default Nav;
