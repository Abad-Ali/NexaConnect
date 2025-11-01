'use client'
import { Input } from '@/components/ui/input'
import LeftSideBar from '@/components/LeftSideBar'
import React, { useState } from 'react'
import axios from 'axios'
import { SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import CarouselSuggestedUsers from '@/components/CarouselSuggetedUser'


const Search = () => {
  const [isActive, setIsActive] = useState(false);
  const [search,setSearch] = useState("");
  const [user, setUser] = useState(null);

  // console.log(search)
  const searchHandler = async()=>{
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/user/search`, {
        params: { username: search },
        withCredentials: true
      });
      if (res.data.success) {
        // console.log("User found:", res.data.user);
        setUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='h-screen overflow-hidden'>
      <LeftSideBar />
    
      <div className="pt-5 md:pt-10 px-7 md:pl-[calc(30vw+3.5rem)] max-w-7xl mx-auto text-white">
        
        <div className="relative min-h-screen">
    
          {/* Background Image Layer */}
          <div   className={`absolute top-30 left-0 right-0 h-[40%] bg-[url('/NexaConnect.png')] bg-no-repeat bg-contain bg-center ${isActive? 'blur-lg' : ''} blur-sm opacity-80 pointer-events-none z-0`}/>
    
          {/* Foreground Content */}
          <div className="relative z-10 flex items-center gap-2 p-2 bg-gray-950 rounded-lg shadow-md ">
            <Input 
              onChange={(e) => {
                setSearch(e.target.value);
                setIsActive(e.target.value.length > 0);
              }}
               onKeyDown={(e) => {if (e.key === "Enter") searchHandler();}}
              text="Search"
              className="flex-1 font-bold px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Search..."
            />
            <Button
              onClick={searchHandler}
              className="p-2 rounded-md cursor-pointer bg-blue-700 hover:bg-blue-800 transition text-white"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
          </div>
           
           {
            isActive && user ? (
              // <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6"></div>
              <div className="my-3 md:my-0 md:mt-12 p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg text-white w-full flex justify-between items-center md:px-5">
                <Link href={`/profile/${user._id}`}><div className='flex items-center gap-2 cursor-pointer'>
                   <Avatar className="w-15 h-15">
                    <AvatarImage src={user?.profilePicture || '/default_pic.jpg'} alt="Profile_pic"/>
                    <AvatarFallback>
                      NC
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col justify-center'>
                    <h2 className="md:text-xl font-bold font-serif mb-1">{user.username}</h2>
                    <span className='text-slate-400 text-xs md:text-sm whitespace-pre-wrap'>
                      {user?.bio?.split('\n')[0]?.length > 40
                        ? 'Just getting started on NexaConnect.'
                        : user?.bio.split('\n')[0] || "Just getting started on NexaConnect."}
                    </span>
                  </div>
                </div></Link>
                <Link href={`/profile/${user._id}`}><Button className="bg-black text-xs md:text-sm hover:bg-gray-950 cursor-pointer mr-2">View Profile</Button></Link>
              </div>
            ):(
              <div className="my-3 md:my-0 md:mt-12 p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg text-white w-full flex justify-between items-center md:px-5">
                <div className='flex items-center justify-center gap-2 cursor-pointer'>
                  <span className='text-sm text-gray-500'>No search </span>
                </div>
              </div>
            )
           }
           <div className='flex flex-col justify-center items-center gap-2'>
              <div className='flex justify-start w-full ml-2 mt-3'><p className='text-gray-400'>Suggestions</p></div>
              <CarouselSuggestedUsers/>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Search
