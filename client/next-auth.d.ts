import {DefaultSession} from "next-auth";

declare module "next-auth"{
  interface Session{
    user:{
      data?:userData
    } & DefaultSession["user"];
  }
}