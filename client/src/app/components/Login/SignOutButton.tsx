"use client";

import { signOut } from "next-auth/react"

const SignInButton = () => {
  return <button onClick={() => signOut()}>Sign Out</button>
}

export default SignInButton;