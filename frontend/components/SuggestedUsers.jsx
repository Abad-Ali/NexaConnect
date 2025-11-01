import Link from 'next/link';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from 'react-redux'
import { Button } from './ui/button';

const SuggestedUsers = () => {
    const {suggestedUsers} = useSelector(store=>store.auth);
  return (
    <div className="h-[300px] overflow-y-auto pr-2  scrollable"> {/* Add height and scroll */}
    {
      suggestedUsers?.map((user) => (
        <div key={user._id} className='flex items-center justify-between gap-3 p-2'>
          <Link href={`/profile/${user?._id}`} className="flex items-center gap-2">
            <Avatar className="w-11 h-11">
              <AvatarImage src={user?.profilePicture || 'default_pic.jpg'} alt="Profile_pic"/>
              <AvatarFallback>NC</AvatarFallback>
            </Avatar>
            <div className='flex flex-col justify-center'>
                <h1 className='font-bold font-serif text-sm'>{user?.username}</h1>
                <span className='text-xs text-slate-500 whitespace-pre-wrap'>
                  {user?.bio?.split('\n')[0]?.length > 40
                  ? 'Just getting started on NexaConnect.'
                  : user?.bio.split('\n')[0] || "Just getting started on NexaConnect."}
                </span>
            </div>
          </Link>
          <Link href={`/profile/${user._id}`}><span className='text-slate-500 text-sm cursor-pointer hover:text-blue-600'>View</span></Link>
        </div>
      ))
    }
  </div>
  )
}

export default SuggestedUsers
