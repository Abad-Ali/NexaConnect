'use client';
import { Bell, Home, MessageCircle, PlusSquare, SearchIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CreatePost from './CreatePost';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover';
import { Button } from './ui/button';
import { clearLikeNotifications } from '@/redux/rtnSlice';
import Link from 'next/link';

const LeftSideBar = () => {
  const router = useRouter();
  const {user} = useSelector(store=>store.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  
  const sidebarItems = [
    { icon:<Home/>, text:"Home"},
    { icon:<Bell/>, text:"Notifications"},
    { icon:<SearchIcon/>, text:"Search"},
    { icon:<PlusSquare/>, text:"Create"},
    { icon:<MessageCircle/>, text:"Messages"},
    { icon:(
    <Avatar className="w-7.7 h-7.7">
      <AvatarImage src={user?.profilePicture || '/default_pic.jpg'} alt="Profile_pic"/>
      <AvatarFallback>NC</AvatarFallback>
    </Avatar>
    ), text:"Profile"},
  ]
  
  
  const LSidebarHandler = (textType)=>{
    if(textType === "Home"){
      router.push('/');
    }else if(textType === "Create"){
      setOpen(true);
    }else if(textType === "Profile"){
      router.push(`/profile/${user?._id}`);
    }else if(textType === "Messages"){
      router.push('/chat');
    }else if(textType === "Search"){
      router.push('/search')
    }
  }
  return (
    <div className='fixed bottom-0 right-0 md:top-5 md:bottom-5 z-10 left-0 p-3 md:p-5 md:mx-7 md:shadow-lg shadow-gray-600 md:border-1 border-slate-500 border-t-1 w-full md:w-[30vw] lg:w-[22%] lg:h-2xl rounded-t-lg md:rounded-lg backdrop-blur-md bg-white/10 md:bg-black text-white flex flex-col items-center'> 
    {/* fixed top-0 left-0 z-10 p-5 w-[20%] h-screen bg-black text-white flex flex-col items-center shadow-md shadow-gray-700 */}
      <div className='flex md:flex-col'>
        <div className="flex items-center mx-auto">
          <img className='w-35 mx-auto mb-2 hidden md:inline' src="/NexaConnect.png" alt="Logo" />
        </div>
        {/* <div className='bg-slate-400 h-[1px] w-[85%] mx-auto mb-7 hidden md:inline'></div> */}
        <hr className='mb-5'/>
        {
          sidebarItems.map((item, index)=>{
              return (
                  <div onClick={()=>LSidebarHandler(item.text)} key={index} className={`font-bold font-serif w-full flex items-center   gap-5 h-8 md:h-14 relative hover:backdrop-blur-md hover:bg-white/10 transition-colors duration-200 cursor-pointer rounded-lg px-5 py-3 ${item.text === 'Notifications' ? 'hidden md:flex' : ""}`}>
                      {item.icon}
                      <span className="hidden md:inline">{item.text}</span>
                
                      {
                        item.text === "Notifications" && (
                          <Popover>
                            <PopoverTrigger>
                              {
                                likeNotification.length > 0 && (
                                  <Button
                                    size="icon"
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-full h-5 w-5 absolute bottom-7 left-7 flex items-center justify-center"
                                  >
                                    {likeNotification.length}
                                  </Button>
                                )
                              }
                              <div className=' w-50 h-12 absolute left-1 bottom-1.5 cursor-pointer'></div> 
                            </PopoverTrigger>
                            <PopoverPortal>
                            <PopoverContent side="right" align="start"  className="md:ml-[22vw] lg:ml-[20vw] bg-black shadow-lg rounded-md w-72 p-4 space-y-2 text-white border-1 border-slate-500 py-5">

                              <div>
                                <span>Notifications</span>
                                <hr className='my-2'/>
                                {
                                  likeNotification.length > 0 && <span onClick={()=>dispatch(clearLikeNotifications())} className='text-xs text-gray-500 flex justify-end cursor-pointer'>Clear All</span>
                                }
                              </div>
                              {likeNotification?.length === 0 ? (
                                <div className='min-h-[30vh] min-w-[20vh] flex justify-center items-center'>
                                  <p className="text-sm text-gray-600">No new notifications</p>
                                </div>
                              ) : (
                                likeNotification?.map((notification) => (
                                  <div key={notification.userId} className="cursor-pointer flex items-center space-x-3 p-2 hover:bg-gray-950 rounded-md transition overflow-y-auto">
                                    <Link href={`/profile/${notification?.userDetails._id}`}>
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={notification?.userDetails?.profilePicture || "/default_pic.jpg"}
                                        alt="Profile picture"
                                      />
                                      <AvatarFallback>NC</AvatarFallback>
                                    </Avatar>
                                    </Link>
                                    <div className="text-sm">
                                      <span className="font-bold">{notification.userDetails?.username}</span>
                                      <span className='font-sans'> liked your post</span>
                                    </div>
                                    
                                  </div>
                                ))
                              )}
                            </PopoverContent>
                            </PopoverPortal>
                          </Popover>
                        )
                      }
                  </div>
              )
          })
        }
      </div><CreatePost open={open} setOpen={setOpen}/>
    </div>
  )
}


export default LeftSideBar
