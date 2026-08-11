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
          
          <div className="shrink-0 border-t border-white/10 p-3 sm:p-4">
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
                          "
                              aria-label="Send message"
                            >
                              <SendHorizonal className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
        </section>
      </div>
    </div>
  )
}

export default SelectedUserPage
