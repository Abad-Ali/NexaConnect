'use client'
import LeftSideBar from '@/components/LeftSideBar'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Edit, MessageCircleReply, SendHorizonal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { setSelectedUser } from '@/redux/authSlice'
import { Input } from '@/components/ui/input'
import Messages from '@/components/Messages'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { setMessages } from '@/redux/chatSlice'

const Chat = () => {
  const [textMessage, setTextMessage] = useState("");
  const {user, suggestedUsers, selectedUser} = useSelector(store=>store.auth);
  const {onlineUsers, messages} = useSelector(store=>store.chat);

  // making input tag to work without clicking again and again 
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedUser]);

  // const isOnline = true;
  const dispatch = useDispatch();
  const router = useRouter();

  const sendMessageHandler = async (receiverId)=>{
    try {
      // console.log("Sending message:", textMessage);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/message/send/${receiverId}`, { textMessage }, {
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      });
      if(res.data.success){
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    dispatch(setSelectedUser(null)); // Clear on mount
  }, [dispatch]);


  // For makeing it to run different on click according to screen size.
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  useEffect(() => {
    const checkScreen = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // Tailwind's lg = 1024px
    };
  
    checkScreen(); // Initial check on mount
    window.addEventListener('resize', checkScreen);
  
    return () => window.removeEventListener('resize', checkScreen);
  }, []);
  const handleClick = (user) => {
    if (isLargeScreen) {
      dispatch(setSelectedUser(user))
    } else {
      router.push(`/chat/${user._id}`)
    }
  }

  return (
    <div className='h-screen overflow-y-hidden md:overflow-y-auto overflow-x-hidden'>
      <LeftSideBar/>
      <div className="md:pl-[calc(30vw+3.1rem)] lg:pl-[calc(25vw)] mx-auto text-white flex pb-24 md:pb-0"> 
        {/* add pb-24 and mdpb-0 because of leftsidebsr */}
        <div className='lg:w-[25vw] w-full flex flex-col items-center m-7 lg:border-r-1 border-gray-500'>
          <section className='flex justify-between items-center w-full lg:w-[24vw] backdrop-blur-md bg-white/10 p-2 rounded-2xl'>
            <div className='flex items-center gap-3'>
              <Link href={`/profile/${user?._id}`}>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user?.profilePicture || 'default_pic.jpg'} alt="Profile_pic"/>
                  <AvatarFallback>
                    NC
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Link href={`/profile/${user?._id}`}><h1 className='font-bold font-serif text-sm'>{user?.username}</h1>
                <span className='text-xs text-slate-500 whitespace-pre-wrap'>
                  {user?.bio?.split('\n')[0]?.length > 40
                  ? 'Just getting started on NexaConnect.'
                  : user?.bio.split('\n')[0] || "Just getting started on NexaConnect."}
                </span>
              </Link>
            </div>
            <Link href='/acount/edit'><Edit className='mr-2'/></Link>
          </section>
          <hr className='border-gray-600 mt-3 w-full lg:w-[24vw]'/>
  
          <section className='overflow-y-auto scrollable h-[78vh] w-full lg:w-[25vw] mx-2 rounded-2xl pb-10 md:pb-0'>
            {
              suggestedUsers.map((suggestedUser)=>{
                const isOnline = onlineUsers.includes(suggestedUser._id);
                return (
                  <div onClick={() => handleClick(suggestedUser)} key={suggestedUser._id} className='my-3 flex justify-between items-center lg:w-[24vw] hover:backdrop-blur-md hover:bg-white/10 transition-colors duration-200 px-3 py-1 cursor-pointer rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <Link href={`/profile/${user?._id}`}>
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={suggestedUser?.profilePicture || 'default_pic.jpg'} alt="Profile_pic"/>
                          <AvatarFallback>
                            NC
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className='flex flex-col justify-center'>
                        <h1 className='font-bold font-serif text-sm'>{suggestedUser?.username}</h1>
                        <span className='text-xs text-slate-500 whitespace-pre-wrap'>
                          {suggestedUser?.bio?.split('\n')[0]?.length > 40
                          ? 'Just getting started on NexaConnect.'
                          : suggestedUser?.bio.split('\n')[0] || "Just getting started on NexaConnect."}
                        </span>
                      </div>
                    </div>
                    {
                      isOnline ? (
                        <Badge className='text-green-500 bg-black'>Online</Badge>
                      ) : (
                        <Badge className='text-red-500 bg-black'>Offline</Badge>
                        )
                    }
                  </div>
                )
              })
            }
          </section>
        </div>
        
        <>
        {
          selectedUser ? (
            <section className='hidden lg:flex lg:flex-col lg:flex-1 lg:mt-3 lg:mr-3 lg:min-h-0'>
              <div className='flex items-center gap-3 p-3'>
                <ArrowLeft onClick={() => dispatch(setSelectedUser(null))} className="w-7 h-7 mr-1"/>
                <Link href={`/profile/${selectedUser?._id}`}>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedUser?.profilePicture || 'default_pic.jpg'} alt="Profile_pic"/>
                    <AvatarFallback>
                      NC
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Link href={`/profile/${selectedUser?._id}`}><h1 className='font-bold font-serif text-sm'>{selectedUser?.username}</h1>
                    <span className='text-xs text-slate-500 whitespace-pre-wrap'>
                      {selectedUser?.bio?.split('\n')[0]?.length > 40
                      ? 'Just getting started on NexaConnect.'
                      : selectedUser?.bio.split('\n')[0] || "Just getting started on NexaConnect."}
                    </span>
                </Link>
              </div>
              <hr className='border-gray-600 w-full'/>
              <div className="flex-1 min-h-0">
                <Messages selectedUser={selectedUser} />
              </div>
              <div className='flex justify-between items-center border-1 border-gray-500 p-2 rounded-2xl backdrop-blur-md bg-white/10'>
                <Input ref={inputRef} value={textMessage} onChange={(e)=>setTextMessage(e.target.value)}
                 onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessageHandler(selectedUser._id);
                      setTextMessage("");
                    }
                  }}
                 type='text' className='focus-visible:ring-transparent border-none font-semibold' placeholder='Message Now...'/>
                <div className='bg-gray-950 rounded-full p-2 cursor-pointer hover:bg-black'><SendHorizonal onClick={()=>sendMessageHandler(selectedUser._id)} className='h-5 text-blue-700'/></div>
              </div>
            </section>
          ) : (
            <div className='hidden lg:flex-1 lg:flex lg:flex-col lg:justify-center lg:items-center lg:mx-auto'>
              <MessageCircleReply className='w-30 h-30 my-3 text-gray-300'/>
              <h1 className='font-semibold font-sans text-lg'>Your messages</h1>
              <span className='font-sans text-sm text-slate-500'>Send a message to start your conversation.</span>
            </div>
          )
        }
        </>
      </div>
    </div>
  )
}

export default Chat;