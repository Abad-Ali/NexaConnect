"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios';
import {Loader2, SquareUserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';
import Image from "next/image";

const Signup = () => {

    const [input, setInput] = useState({
        username:"",
        email:"",
        password:""
    });

    const [loading, setloading] = useState(false);

    const handleChange = (e)=>{
        setInput({...input, [e.target.name]:e.target.value});
    };

    const router = useRouter();

    const signupHandler = async(e)=>{
        e.preventDefault();
        // console.log(input);
        setloading(true)

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/user/register`, input,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
                router.push("/login")
                toast.success(res.data.message);
                setInput({
                    username:"",
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
  return (
    <>
       <div className="flex items-center justify-center md:min-h-screen w-screen bg-black md:bg-[url('/bg.png')] md:bg-cover md:bg-center">
                
           <form onSubmit={signupHandler} className='md:shadow-xs md:shadow-gray-600 bg-black flex flex-col gap-5 p-7 md:rounded-2xl text-white w-[90%] max-w-md'>
               <div>
                   <Image className='w-40 h-32 mx-auto mb-2' src="NexaConnect.png" alt="Logo"/>
                   <p className='text-2xl font-bold font-serif text-center '>Signup</p>
                   <p className='text-gray-300 text-center mt-2 font-serif italic'>Connect with friends and share your moments.</p>
               </div>
               
               <Label htmlFor="username" className="font-serif font-bold">Username : </Label>
               <Input type="text" id="username" name="username" value={input.username} onChange={handleChange} className="bg-white text-black font-serif    italic placeholder:italic" placeholder="@hexaConnect"></Input>
   
               <Label htmlFor="email" className="font-serif font-bold">Email : </Label>
               <Input type="email" id="email" name="email" value={input.email} onChange={handleChange} className="bg-white text-black font-serif italic    placeholder:italic" placeholder="hexaConnect@gmail.com"></Input>
   
               <Label htmlFor="password" className="font-serif font-bold">Password : </Label>
               <Input type="password" id="password" name="password" value={input.password} onChange={handleChange} className="bg-white text-black    font-serif italic placeholder:italic" placeholder="create password"></Input>
               
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
                    <SquareUserIcon/>
                     Signup
                   </Button>
                 )
               }
   
               <span className="text-right text-xs text-gray-300 font-serif">
                   Already have an account? <a href="/login" className="underline text-blue-400 mr-3 font-bold font-serif">Login</a>
               </span>
           </form>
       </div>
    </>
  )
}

export default Signup
