import { NextResponse } from 'next/server'

export async function GET(){
  const url = process.env.SERVER_URL as string;
  const res = await fetch(url+"/api/music",{headers:{
    api_key: process.env.SERVER_API_KEY as string,
  }});
  const musicData = await res.json();
  return NextResponse.json({data:musicData},{ status: 200 });
}