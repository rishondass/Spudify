import { NextResponse } from 'next/server';
import type {GetServerSidePropsContext} from "next";
import YTMusic from "ytmusic-api"
export async function GET(request:Request,context:GetServerSidePropsContext){
  
  const {params} = context;
  const id = params?.id || "";
  const ytMusic = await new YTMusic().initialize()
  const search = await ytMusic?.searchSongs(id as string);
  const song = await ytMusic?.getSong("B1kJ9RnHZ9o")

  const result = song?.adaptiveFormats.find((song) =>{return song.mimeType == `audio/webm; codecs="opus"`});
  
  const objUrl = URL.createObjectURL(result);
  console.log(objUrl);
  return NextResponse.json({})
  
}