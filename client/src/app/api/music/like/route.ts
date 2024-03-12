import { NextResponse } from 'next/server'

export async function POST(req:Request){
  const url = process.env.SERVER_URL as string;
  const payload = await req.json();
  const res = await fetch(url+"/api/music/like",{
    method: "POST",
    headers:{
      api_key: process.env.SERVER_API_KEY as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
});
  if(res.status === 200){
    return Response.json({},{status:200});
  }
  return Response.json({},{status:500});
  
}