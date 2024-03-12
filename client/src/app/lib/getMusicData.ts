import {auth} from "@/app/api/auth/[...nextauth]/auth";
export default async function getMusicData(id?:string){
  const url = process.env.SERVER_URL as string;
  const session = await auth();
    if(id){
      const res = await fetch(url+"/api/music/info/"+id,{
        headers:{
          api_key: process.env.SERVER_API_KEY as string,
        },
        cache:'no-store'
      });
      const musicData = await res.json();
      return musicData;
    }else{
      const res = await fetch(url+"/api/music",{
        headers:{
          api_key: process.env.SERVER_API_KEY as string,
          userID: session?.user.data?.id as string
        },
        cache:'no-store'
      });
      const musicData = await res.json();
      return musicData;
    }
    
}