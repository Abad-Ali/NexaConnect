import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Comment = ({comment}) => {
  return (
    <div className='my-3'>
      <div className='flex items-center gap-2'>
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment?.author?.profilePicture ||'/default_pic.jpg'} alt='Post_image'/>
          <AvatarFallback><img src='./favicon.ico'/></AvatarFallback>
        </Avatar>
        {/* <div className='flex flex-col justify-center'>
            <h1 className='font-bold font-serif'>{comment?.author?.username}</h1>
            <span className='text-slate-500 text-sm'>{comment?.author?.bio || "Just getting started on NexaConnect."}</span>
        </div> */}
        <h1 className='font-bold font-serif'>{comment?.author?.username}</h1>
        <span className='text-slate-200'>{comment?.text}</span>
      </div>
    </div>
  )
}

export default Comment
