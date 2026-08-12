import Link from 'next/link';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from 'react-redux'
import { Button } from './ui/button';

const SuggestedUsers = () => {
    const {suggestedUsers} = useSelector(store=>store.auth);
  return (
    <div className="h-[60dvh] overflow-y-auto pr-2 custom-scrollbar space-y-1 scrollable py-2vh">
      {suggestedUsers?.map((user) => {
        // Safely extract the first line of the bio
        const firstBioLine = user?.bio?.split('\n')[0]?.trim();
        const displayBio = firstBioLine && firstBioLine.length <= 40 
          ? firstBioLine 
          : "Just getting started on NexaConnect.";
    
        return (
          <div 
            key={user?._id} 
            className="flex items-center justify-between gap-4 p-2.5 rounded-xl transition-all duration-200 hover:bg-white/10 group"
          >
            {/* User Profile Link */}
            <Link href={`/profile/${user?._id}`} className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="w-11 h-11 border border-slate-100 dark:border-slate-800 shrink-0 shadow-sm">
                <AvatarImage src={user?.profilePicture || 'default_pic.jpg'} alt={`${user?.username}'s profile`} />
                <AvatarFallback className="font-semibold text-xs bg-slate-100 text-slate-600">
                  {user?.username?.substring(0, 2).toUpperCase() || 'NC'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm text-white tracking-tight truncate group-hover:text-blue-600 transition-colors">
                  {user?.username}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {displayBio}
                </span>
              </div>
            </Link>
    
            {/* Action Button */}
            <Link 
              href={`/profile/${user?._id}`}
              className="text-xs font-medium text-white bg-white/20 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white px-3 py-1.5 rounded-lg transition-all shrink-0 shadow-sm"
            >
              View
            </Link>
          </div>
        );
      })}
    </div>

  )
}

export default SuggestedUsers
