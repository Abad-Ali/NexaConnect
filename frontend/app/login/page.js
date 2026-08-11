"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios';
import { Loader2, LogInIcon, UserRoundCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import Image from "next/image";

const Login = () => {
  const {user} = useSelector(store=>store.auth);
    const [input, setInput] = useState({
        email:"",
        password:""
    });

    const [loading, setloading] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (e)=>{
        setInput({...input, [e.target.name]:e.target.value});
    };

    const router = useRouter();

    const loginHandler = async(e)=>{
        e.preventDefault();
        // console.log(input);

        try {
            setloading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/user/login`,input,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
              dispatch(setAuthUser(res.data.user));
              router.replace("/");
              toast.success(res.data.message);
              setInput({
                  email:"",
                  password:""
              })
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            setloading(false);
        }
    }

    const demoLoginHandler = async () => {
        try {
            setloading(true);
    
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/user/demo-login`,{},{
                  withCredentials: true
                }
            );
    
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                router.replace("/");
                toast.success(res.data.message);
            }
    
        } catch (error) {
            console.error("Demo login error:", error);
    
            toast.error(
                error?.response?.data?.message || "Demo login failed"
            );
        } finally {
            setloading(false);
        }
    };

    useEffect(()=>{
      if(user){
        router.replace('/')
      }
    })
  return (
    <>
       <div className="flex items-center justify-center md:min-h-screen w-screen bg-black md:bg-[url('/bg.png')] md:bg-cover md:bg-center overflow-y-hidden">
                
           <form onSubmit={loginHandler} className='md:shadow-xs md:shadow-gray-600 bg-black flex flex-col gap-5 p-7 md:rounded-2xl text-white w-[90%] max-w-md'>
               <div>
                   <Image className='w-40 h-32 mx-auto mb-2' src="NexaConnect.png" alt="Logo" width={100} height={100}/>
                   <p className='text-2xl font-bold font-serif text-center '>Login</p>
                   <p className='text-gray-300 text-center mt-2 font-serif italic'>Connect with friends and share your moments.</p>
               </div>
               
               <Label htmlFor="email" className="font-serif font-bold">Email : </Label>
               <Input type="email" id="email" name="email" value={input.email} onChange={handleChange} className="bg-white text-black font-serif italic    placeholder:italic" placeholder="hexaConnect@gmail.com"></Input>
   
               <Label htmlFor="password" className="font-serif font-bold">Password : </Label>
               <Input type="password" id="password" name="password" value={input.password} onChange={handleChange} className="bg-white text-black    font-serif italic placeholder:italic" placeholder="Enter your password"></Input>
               
               {
                 loading ? (
                   <Button
                     disabled
                     className="bg-blue-600 cursor-not-allowed opacity-70 font-bold font-serif py-2 px-4 rounded-md text-white text-sm sm:text-base mt-2 flex items-center justify-center gap-2"
                   >
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Please wait
                   </Button>
                 ) : (
                   <Button
                     type="submit"
                     className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 font-bold font-serif py-2 px-4 rounded-md text-white text-sm sm:text-base mt-2 cursor-pointer"
                   >
                    <LogInIcon/>
                    Login
                   </Button>
                 )
               }

               <div className="flex items-center gap-3 my-1">
                  <div className="h-px bg-gray-600 flex-1"></div>
                  <span className="text-xs text-gray-400">OR</span>
                  <div className="h-px bg-gray-600 flex-1"></div>
                </div>
                
                <Button type="button" onClick={demoLoginHandler} disabled={loading} className="bg-gray-900 hover:bg-gray-800 transition-colors duration-200 font-bold font-serif py-2 px-4 rounded-md text-white text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2">
                    {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                    ) : (
                        <>
                          <UserRoundCheck className="h-4 w-4" />
                          Try Demo Account
                        </>
                    )}
                </Button>
   
               <span className="text-right text-xs text-gray-300 font-serif">
               {"Doesn't have an account?"} <a href="/signup" className="underline text-blue-400 mr-3 font-bold font-serif">Signup</a>
               </span>
           </form>
       </div>
    </>
  )
}

export default Login
