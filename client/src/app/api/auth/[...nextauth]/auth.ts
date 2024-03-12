import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    // ...add more providers here
  ],
  callbacks:{
    async session({ session, user}) {
      const url = process.env.SERVER_URL as string;
      const res = await fetch(url+`/api/users/${session.user.email}`,{
        headers:{
          'api_key' : process.env.SERVER_API_KEY as string,
          'username': session.user.name as string,
        }
      });
      
      const data:userData = await res.json();
      session.user.data = data;
      return session
    },
  },
  pages:{
    signIn:"/login"
  }
} satisfies NextAuthOptions

// Use it in server contexts
export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, config)
}