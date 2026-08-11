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
    <div className="min-h-screen text-white">
      <div className="md:hidden">
        <Header />
      </div>
    
      <LeftSideBar />
    
      <main className="w-full px-4 pb-28 pt-20 sm:px-6 md:ml-[calc(30vw+1rem)] md:w-[calc(70vw-1rem)] md:px-8 md:pb-10 md:pt-10 lg:ml-[30vw] lg:w-[70vw]">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Edit Profile</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Keep your profile up to date so people can learn more about you.
            </p>
          </div>
    
          <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-blue-600/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-purple-600/10 blur-3xl" />
    
            <div className="relative flex flex-col gap-6 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative shrink-0">
                  <Avatar className="h-20 w-20 border-2 border-white/10 shadow-xl sm:h-24 sm:w-24">
                    <AvatarImage src={user?.profilePicture || "/default_pic.jpg"} alt="Profile picture" className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold">
                      {user?.username?.slice(0, 2)?.toUpperCase() || "NC"}
                    </AvatarFallback>
                  </Avatar>
    
                  <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-[#101218] bg-emerald-500" />
                </div>
    
                <div className="min-w-0">
                  <Link href={`/profile/${user?._id}`} className="block cursor-pointer truncate text-lg font-bold transition-colors hover:text-blue-400 sm:text-xl">
                    {user?.username || "No name set"}
                  </Link>
    
                  <p className="mt-1 line-clamp-2 max-w-md text-sm leading-5 text-zinc-500">
                    {user?.bio?.split("\n")[0]?.length > 40 ? "Just getting started on NexaConnect." : user?.bio?.split("\n")[0] || "Just getting started on NexaConnect."}
                  </p>
    
                  <Link href={`/profile/${user?._id}`} className="mt-2 inline-block cursor-pointer text-xs font-semibold text-blue-400 hover:text-blue-300">
                    View profile →
                  </Link>
                </div>
              </div>
    
              <div className="shrink-0">
                <input ref={imageRef} onChange={fileChangeHandler} type="file" accept="image/*" className="hidden" />
    
                <Button
                  onClick={() => imageRef.current?.click()}
                  className="h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.07] px-5 font-semibold text-white shadow-lg transition-all hover:border-white/20 hover:bg-white/[0.12] sm:w-auto"
                >
                  Change photo
                </Button>
              </div>
            </div>
          </section>
    
          <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/20">
            <div className="border-b border-white/[0.07] px-5 py-5 sm:px-7">
              <h2 className="text-lg font-bold">Personal information</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Update the information displayed on your profile.
              </p>
            </div>
    
            <div className="space-y-7 p-5 sm:p-7">
              <div>
                <div className="mb-2.5">
                  <label className="text-sm font-semibold text-zinc-200">Your name</label>
                  <p className="mt-1 text-xs text-zinc-500">This is the name people will see on your profile.</p>
                </div>
    
                <Textarea
                  value={input.name}
                  onChange={(e) => setInput({ ...input, name: e.target.value })}
                  className="min-h-[52px] resize-none rounded-xl border-white/10 bg-white/[0.035] px-4 py-3 text-sm placeholder:text-zinc-600 focus-visible:border-blue-500/50 focus-visible:ring-2 focus-visible:ring-blue-500/10"
                  placeholder="Enter your name"
                />
              </div>
    
              <div>
                <div className="mb-2.5">
                  <label className="text-sm font-semibold text-zinc-200">Bio</label>
                  <p className="mt-1 text-xs text-zinc-500">Tell people a little about yourself.</p>
                </div>
    
                <Textarea
                  value={input.bio}
                  onChange={(e) => setInput({ ...input, bio: e.target.value })}
                  className="min-h-[120px] resize-none rounded-xl border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 placeholder:text-zinc-600 focus-visible:border-blue-500/50 focus-visible:ring-2 focus-visible:ring-blue-500/10"
                  placeholder="Tell us a little about yourself..."
                />
    
                <div className="mt-2 text-right text-xs text-zinc-600">
                  {input.bio?.length || 0} characters
                </div>
              </div>
    
              <div>
                <div className="mb-2.5">
                  <label className="text-sm font-semibold text-zinc-200">Gender</label>
                  <p className="mt-1 text-xs text-zinc-500">Choose how you want this information displayed.</p>
                </div>
    
                <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                  <SelectTrigger className="h-14 w-full cursor-pointer rounded-xl border-white/10 bg-white/[0.035] px-4 text-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
    
                  <SelectContent className="rounded-xl border-white/10 bg-[#111318] shadow-2xl">
                    <SelectItem value="male" className="cursor-pointer text-white focus:bg-white/10 focus:text-white">
                      Male
                    </SelectItem>
                    <SelectItem value="female" className="cursor-pointer text-white focus:bg-white/10 focus:text-white">
                      Female
                    </SelectItem>
                    <SelectItem value="prefer not to say" className="cursor-pointer text-white focus:bg-white/10 focus:text-white">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
    
              <div className="flex gap-3 rounded-2xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
                <div className="mt-0.5 shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                </div>
    
                <div>
                  <p className="text-sm font-semibold text-zinc-300">Profile visibility</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Certain profile information, such as your name and bio, may be visible to everyone.
                  </p>
                </div>
              </div>
    
              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:justify-end">
                {loading ? (
                  <Button
                    disabled
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 font-bold shadow-lg shadow-blue-900/20 sm:w-auto"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </Button>
                ) : (
                  <Button
                    onClick={editProfileHandle}
                    className="h-12 w-full cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 font-bold shadow-lg shadow-blue-900/20 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-900/30 sm:w-auto"
                  >
                    Save changes
                  </Button>
                )}
              </div>
            </div>
          </section>
    
          <p className="mt-6 text-center text-xs text-zinc-700">
            Your profile changes will be visible across NexaConnect.
          </p>
        </div>
      </main>
    </div>
  )
}
    
export default Edit