import type {GetServerSidePropsContext} from "next";
import {NextResponse} from 'next/server'

export async function GET() {
  return Response.json({});
}