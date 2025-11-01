'use client';
import LeftSideBar from '@/components/LeftSideBar'
import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';


const Edit = () => {
  const imageRef = useRef();
  const {user} = useSelector(store=>store.auth);
  const [loading, setLoading] = useState(false);
  const [input,setInput] = useState({
    profilePicture: user?.profilePicture,
    name: user?.name,
    bio: user?.bio,
    gender: user?.gender || 'prefer not to say'
  })

  const router = useRouter();
  const dispatch = useDispatch();

  const fileChangeHandler = (e)=>{
    const file = e.target.files?.[0];
    if(file){
      setInput({...input, profilePicture:file});
    }
  }
  const selectChangeHandler = (value)=>{
    setInput({...input, gender: value});
  }

  const editProfileHandle = async()=>{
    // console.log(input);
    const formData = new FormData();
    formData.append('name',input?.name);
    formData.append('bio',input?.bio);
    formData.append('gender',input?.gender);
    if(input.profilePicture){
      formData.append("profilePicture", input?.profilePicture);
    }
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/user/profile/edit`, formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        },
        withCredentials:true
      });
      if(res.data.success){
        const updatedUserData = {
          ...user,
          name:res.data.user?.name,
          bio:res.data.user?.bio,
          profilePicture:res.data.user?.profilePicture,
          gender:res.data.user?.gender
        };
        dispatch(setAuthUser(updatedUserData));
        router.replace(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message);
    }finally{
      setLoading(false);
    }
  }
  return (
    <div className='h-screen mt-16 mb-26 md:mb-0 md:mt-0'>
      <div className='inline md:hidden'>
        <Header/>
      </div>
      <LeftSideBar/>
      <div className="pt-5 md:pt-10 px-7 md:pl-[calc(30vw+3.5rem)] max-w-7xl mx-auto text-white">
        <h1 className='font-bold font-serif text-xl md:text-2xl'>Edit Profile</h1>
        <section className='flex flex-col md:flex-row justify-between md:items-center cursor-pointer my-3 md:my-7 backdrop-blur-md bg-white/10 p-3 px-5 rounded-xl'>
          <div className='flex items-center gap-1'>
              <Avatar className="w-15 h-15">
                  <AvatarImage src={user?.profilePicture || '/default_pic.jpg'} alt="Profile_pic"/>
                  <AvatarFallback>
                    NC
                  </AvatarFallback>
                </Avatar>
              <div className='m-2'>
                <h1 className='font-bold font-serif text-lg'><Link href={`/profile/${user?._id}`}>{user?.username || "No name set"}</Link></h1>
                <span className='text-slate-500 font-semibold text-xs whitespace-pre-wrap'>
                  {user?.bio?.split('\n')[0]?.length > 40
                  ? 'Just getting started on NexaConnect.'
                  : user?.bio.split('\n')[0] || "Just getting started on NexaConnect."}
                </span>
              </div>
          </div>

          <div className='flex justify-end'>
            <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden'/>
            <Button onClick={()=>imageRef.current.click()} className='cursor-pointer bg-black hover:bg-black'>Change Profile Pic</Button>
          </div>
        
        </section>
        <hr className='border-gray-600'/>

        <div className='lg:max-h-[calc(100vh-340px)] overflow-y-auto scrollable p-5 '>
          <section className='mb-3'>
            <h2 className='font-bold md:text-xl mb-3'>Your Name</h2>
            <Textarea value={input.name} onChange={(e)=>setInput({...input, name: e.target.value})} className='focus-visible:ring-transparent border-gray-400' placeholder="Enter your name"/>
          </section>
  
          <section className='mb-3'>
            <h2 className='font-bold md:text-xl mb-3'>Bio</h2>
            <Textarea value={input.bio} onChange={(e)=>setInput({...input, bio: e.target.value})} className='focus-visible:ring-transparent border-gray-400' placeholder="Tell us a little about yourself..."/>
          </section>

          <section className='mb-3'>
            <h2 className='font-bold md:text-xl mb-3'>Gender</h2>
            <Select defaultValue={input.gender}
             onValueChange={selectChangeHandler}>
              <SelectTrigger className="w-full py-7 focus-visible:ring-transparent border-gray-400">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className='bg-gray-950'>
                <SelectItem value="male" className="hover:bg-gray-950 focus:bg-gray-900 text-white focus:text-white">Male</SelectItem>
                <SelectItem value="female" className="hover:bg-gray-950 focus:bg-gray-900 text-white focus:text-white">Female</SelectItem>
                <SelectItem value="prefer not to say" className="hover:bg-gray-950 focus:bg-gray-900 text-white focus:text-white">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </section>

          <div className='text-slate-500 text-[0.8rem] justify-center item-center lg:justify-start font-semibold my-5'>Certain profile info, such as your name, and bio, is visible to everyone.</div>

          <div className='flex justify-end my-3'>
            {
              loading ? (
                <Button className='bg-blue-900 hover:bg-blue-950 w-full lg:w-xs py-6 rounded-xl font-bold text-sm cursor-pointer'><Loader2 className='mr-2 h-4 w-4 animate-spin'/>Updating...</Button>
              ):(
                <Button onClick={editProfileHandle} className='bg-blue-900 hover:bg-blue-950 w-full lg:w-xs py-5 rounded-xl font-bold text-sm cursor-pointer'>Submit</Button>
              )
            }
            
          </div>
        </div>

        </div>
    </div>
  )
}

export default Edit
