"use client"
import { LogInIcon, LogOutIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'
import SuggestedUsers from './SuggestedUsers'
import Link from 'next/link'

const RightSideBar = () => {

  const router = useRouter();
  const {user} = useSelector(store=>store.auth);
  const dispatch = useDispatch();

  const logoutHandler = async()=>{
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/user/logout`, {withCredentials:true});
      if(res.data.success){
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        localStorage.removeItem("token");
        router.replace("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const RSidebarHandler = (textType)=>{
    if(textType === 'LogOut'){
      logoutHandler();
    }else if(textType === 'Login with other account?'){
      logoutHandler();
      router.replace("/login");
      toast.success("Welcome to NexaConnect!")
    }
  }

  const sidebarItems = [
    // { icon:(
    // <Avatar className="w-11 h-11">
    //   <AvatarImage src={user?.profilePicture || 'default_pic.jpg'} alt="Profile_pic"/>
    //   <AvatarFallback>
    //     NC
    //   </AvatarFallback>
    // </Avatar>

    // ), text:"AccountName"},
    { icon:<LogOutIcon className='text-red-600'/>, text:"LogOut"},
    { icon:<LogInIcon className='text-blue-700'/>, text:"Login with other account?"},
  ]
  
  return (
    <div className='hidden md:inline'>
      <div className='fixed top-5  z-10 right-0 p-5 mx-7 shadow-lg shadow-gray-600 border-1 border-slate-500 w-[22%] h-xl rounded-lg bg-black text-white flex flex-col'>
        <div className='text-slate-400 font-semibold'>Suggestions for you...</div>
        <hr className='w-full my-5'/>
        <div><SuggestedUsers/></div>
      </div>

      <div className='fixed  bottom-5 z-5 right-0 p-5 mx-7 shadow-lg shadow-gray-600 border-1 border-slate-500 w-[22%] h-xl rounded-lg bg-black text-white flex flex-col items-center'>
        <div>
          <div className='flex items-center gap-3 px-4 cursor-pointer mb-3'>
            <Link href={`/profile/${user?._id}`}>
              <Avatar className="w-11 h-11">
                <AvatarImage src={user?.profilePicture || '/default_pic.jpg'} alt="Profile_pic"/>
                <AvatarFallback>
                  NC
                </AvatarFallback>
              </Avatar>
            </Link>
            <Link href={`/profile/${user?._id}`}><h1 className='font-bold font-serif text-xl'>{user?.username}</h1></Link> 
            <Badge>
              Owner
            </Badge>
          </div>
          <hr/>
          {
            sidebarItems.map((item, index)=>{
                return (
                  <div onClick={()=>RSidebarHandler(item.text)} key={index} className='font-bold font-serif w-full flex items-center gap-5 h-10 relative hover:backdrop-blur-md hover:bg-white/10 transition-colors duration-200 cursor-pointer rounded-lg px-5 py-7 my-2'>
                      {item.icon}
                      <span className="hidden md:inline">{item.text}</span>
                  </div>
                )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default RightSideBar
