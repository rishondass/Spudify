import { NextResponse } from 'next/server'

export async function GET(req:Request){
  const url = process.env.SERVER_URL as string;
  const res = await fetch(url+"/api/music",{headers:{
    api_key: process.env.SERVER_API_KEY as string,
    userID: req.headers.get('userID') as string,
  }});
  const musicData = await res.json();
  return NextResponse.json({data:musicData},{ status: 200 });
}

export async function POST(req:Request){
  const data = await req.formData();
  const url = process.env.SERVER_URL as string;
  const res = await fetch(url+"/api/music",{
    method: "POST",
    body: data,
    headers:{
      api_key: process.env.SERVER_API_KEY as string,
    },
});
  return NextResponse.json({},{ status: res.status});
}

export async function DELETE(req:Request){
  const data = await req.json();
  const url = process.env.SERVER_URL as string;
  const res = await fetch(url+"/api/music",{
    method: "DELETE",
    body: JSON.stringify({songID:data}),
    headers:{
      api_key: process.env.SERVER_API_KEY as string,
      'Content-type': 'application/json',
    },
  });
  return NextResponse.json({},{ status: res.status});
}