'use client'

import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '@/redux/authSlice'
import LeftSideBar from '@/components/LeftSideBar'
import Messages from '@/components/Messages'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, SendHorizonal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { setMessages } from '@/redux/chatSlice'

const SelectedUserPage = () => {
  const inputRef = useRef(null);
  const [textMessage, setTextMessage] = useState("");
  const params = useParams();
  const userId = params.userId; // or params.id if your folder is named [id]

  const dispatch = useDispatch();
  const { suggestedUsers } = useSelector(store => store.auth);
  const [localUser, setLocalUser] = useState(null);
  const {messages} = useSelector(store=>store.chat);

  useEffect(() => {
    if (!userId || !suggestedUsers.length) return

    const foundUser = suggestedUsers.find(user => user._id === userId);
    if (foundUser) {
      dispatch(setSelectedUser(foundUser));
      setLocalUser(foundUser);
    }
  }, [userId, suggestedUsers, dispatch]);

  if (!localUser) {
    return <div>Loading...</div>;
  }


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
         inputRef.current?.focus(); // <-- refocus after sending
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="h-screen text-white overflow-hidden lg:hidden">
      {/* <LeftSideBar /> */}
      <div className="mx-auto text-white flex">
        <section className="flex flex-col flex-1 mt-3 mr-3 min-h-0">
          <div className="flex items-center gap-3 p-3">
            <Link href="/chat">
              <ArrowLeft className="w-7 h-7 mr-1" />
            </Link>
            <Link href={`/profile/${localUser._id}`}>
              <Avatar className="w-12 h-12">
                <AvatarImage src={localUser.profilePicture || '/default_pic.jpg'} alt="Profile_pic" />
                <AvatarFallback>NC</AvatarFallback>
              </Avatar>
            </Link>
            <Link href={`/profile/${localUser._id}`}>
              <h1 className="font-bold font-serif text-sm">{localUser.username}</h1>
              <span className="text-xs text-slate-500 whitespace-pre-wrap">
                {localUser.bio?.split('\n')[0]?.length > 40
                  ? 'Just getting started on NexaConnect.'
                  : localUser.bio.split('\n')[0] || 'Just getting started on NexaConnect.'}
              </span>
            </Link>
          </div>
          <hr className="border-gray-600 w-full" />
          <div className="flex-1 min-h-0">
            <Messages selectedUser={localUser} />
          </div>
          <div className="fixed bottom-1 w-full flex justify-between items-center border-t-1 border-gray-500 p-2 rounded-2xl backdrop-blur-md bg-white/10">
            <Input
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessageHandler(localUser._id);
                  setTextMessage("");
                }
              }}
              value={textMessage} onChange={(e)=>setTextMessage(e.target.value)}
              type="text"
              className="focus-visible:ring-transparent border-none font-semibold"
              placeholder="Message Now..."
            />
            <div className="bg-gray-950 rounded-full p-2 cursor-pointer hover:bg-black">
              <SendHorizonal onClick={()=>sendMessageHandler(localUser._id)} className="h-5 text-blue-700" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SelectedUserPage
