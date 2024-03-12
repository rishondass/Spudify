
import LinkedSongsButton from "@/app/components/LikedSongsButton"
import Nav from "@/app/components/SideBar/Nav";


export default async function Home() {
  return <div className="bg-gradient-to-b from-[#292929] from-[1%] via-backgroundBg via-50% h-full">
    <Nav>
      <div className="grid grid-cols-3 px-4">
          
            <LinkedSongsButton/>
          
          
      </div>
    </Nav>
  </div>
}
