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
    <div className="h-screen w-screen bg-zinc-950 text-white overflow-hidden flex flex-col lg:hidden">
      {/* <LeftSideBar /> */}
      
      {/* Header Section: Fixed Height */}
      <header className="flex flex-col shrink-0">
        <div className="flex items-center gap-3 p-4 bg-zinc-950/50 backdrop-blur-md">
          <Link href="/chat" className="transition-transform active:scale-95">
            <ArrowLeft className="w-6 h-6 text-zinc-400 hover:text-white" />
          </Link>
          
          <Link href={`/profile/${localUser._id}`} className="transition-opacity hover:opacity-90">
            <Avatar className="w-11 h-11 border border-zinc-800">
              <AvatarImage src={localUser.profilePicture || '/default_pic.jpg'} alt="Profile_pic" />
              <AvatarFallback className="bg-zinc-800 text-zinc-200">NC</AvatarFallback>
            </Avatar>
          </Link>
          
          <Link href={`/profile/${localUser._id}`} className="flex flex-col min-w-0 flex-1">
            <h1 className="font-semibold text-sm tracking-wide text-zinc-100 truncate">
              {localUser.username}
            </h1>
            <span className="text-xs text-zinc-400 truncate block">
              {localUser.bio?.split('\n')[0]?.length > 40
                ? 'Just getting started on NexaConnect.'
                : localUser.bio?.split('\n')[0] || 'Just getting started on NexaConnect.'}
            </span>
          </Link>
        </div>
        <hr className="border-zinc-800 w-full" />
      </header>
    
      {/* Chat/Messages Section: Only Scrollable Area */}
      <main className="flex-1 overflow-y-auto min-h-0 bg-zinc-900/20">
        <Messages selectedUser={localUser} />
      </main>
      
      {/* Input Section: Fixed Bottom Height (Exactly Same Logic & Layout) */}
      <footer className="shrink-0 border-t border-zinc-800 bg-zinc-950 p-3 sm:p-4 pb-safe">
        <div className="mx-auto flex max-w-5xl items-center gap-2">
          <Input
            ref={inputRef}
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                textMessage?.trim()
              ) {
                e.preventDefault();
                sendMessageHandler(localUser._id);
                setTextMessage("");
              }
            }}
            type="text"
            className="
              h-12 flex-1 rounded-xl
              border border-white/10
              px-4
              text-sm font-medium
              placeholder:text-zinc-600
              focus-visible:border-white/20
              focus-visible:ring-0
              bg-zinc-900
            "
            placeholder={`Message ${localUser?.username || "user"}...`}
          />
    
          <button
            type="button"
            onClick={() => {
              if (!textMessage?.trim()) return;
    
              sendMessageHandler(localUser._id);
              setTextMessage("");
            }}
            disabled={!textMessage?.trim()}
            className="
              flex h-12 w-12 shrink-0 cursor-pointer
              items-center justify-center rounded-xl
              border border-white/10
              text-blue-500
              transition-colors
              hover:border-blue-500/40
              hover:text-blue-400
              disabled:cursor-not-allowed
              disabled:text-zinc-700
              disabled:bg-transparent
            "
            aria-label="Send message"
          >
            <SendHorizonal className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </div>

  )
}

export default SelectedUserPage
    