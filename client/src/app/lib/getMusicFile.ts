"use server";
export default async function getMusicFile(id:string){
  console.log(process.env.SERVER_URL);
  const url = process.env.SERVER_URL as string;
  const res = await fetch(url+"/api/music?api_key="+process.env.SERVER_API_KEY,{
    headers:{
      api_key: process.env.SERVER_API_KEY as string,
    },
    cache:'no-store'
  });
    return res.arrayBuffer();
    
}