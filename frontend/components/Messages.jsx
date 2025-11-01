import React, { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector(store => store.chat);
  const { user } = useSelector(store => store.auth);

  const containerRef = useRef(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  //  Format timestamp
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
    return date.toDateString() === today.toDateString();
  };


  return (
    <div ref={containerRef} className="h-[78vh] overflow-y-auto scrollable py-5">
      <div className="my-2 flex flex-col items-center gap-4">
        <div className="flex flex-col justify-center items-center gap-2">
          <Avatar className="w-24 h-24">
            <AvatarImage src={selectedUser?.profilePicture || '/default_pic.jpg'} alt="Profile_pic" />
            <AvatarFallback>NC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 items-center">
            <h1 className="font-bold font-sans text-lg">{selectedUser?.name || 'No Name'}</h1>
            <h1 className="font-bold font-sans text-sm text-slate-500">
              {selectedUser?.username}<span> • NexaConnect</span>
            </h1>
          </div>
        </div>
        <Link href={`/profile/${selectedUser?._id}`}>
          <Button className="cursor-pointer px-7">View Profile</Button>
        </Link>
      </div>

      {/* Messages Section */}
      <div className="flex flex-col gap-3 my-10 px-3">
        {messages && messages.map((msg) => {
          const isSender = msg.senderId.trim() === user._id.trim();

          return (
            <div key={msg._id} className={`flex flex-col ${isSender ? "items-end" : "items-start"} my-1`}>
              <div className={`flex items-end gap-2 ${isSender ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="w-7 h-7">
                  <AvatarImage
                    src={isSender ? (user?.profilePicture || '/default_pic.jpg') : (selectedUser?.profilePicture || '/default_pic.jpg')}
                    alt="Profile_pic"
                  />
                  <AvatarFallback>NC</AvatarFallback>
                </Avatar>

                <div className={`group relative px-3 py-2 rounded-2xl max-w-[60%] break-words text-sm ${isSender ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-800 text-white rounded-bl-none"}`}>
                  {msg.message || msg.messages}
                </div>
              </div>

              {/* Always-visible small timestamp below message */}
              <span className="text-[10px] text-gray-400 mt-1 mx-10">
                {msg.createdAt ? formatTime(msg.createdAt) : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
