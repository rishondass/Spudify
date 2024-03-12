"use client";

import { signIn } from "next-auth/react"

const SignInButton = () => {
  return <button onClick={() => signIn("google",{ callbackUrl: '/' })}>Sign in</button>
}

export default SignInButton;