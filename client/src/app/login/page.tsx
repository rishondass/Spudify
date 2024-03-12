import {auth} from "@/app/api/auth/[...nextauth]/auth";
import SignInButton from "../components/Login/SignInButton";
import { redirect } from 'next/navigation'


const Login = async() => {
  const session = await auth();
  if (session) {
    redirect('/');
  }
  else{
  return <>
    <div>Login</div>
    <SignInButton/>
  </>
  }
  
}

export default Login