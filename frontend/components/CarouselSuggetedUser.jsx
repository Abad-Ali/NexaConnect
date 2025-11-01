'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from './ui/button';
import Link from 'next/link';

const CarouselSuggestedUsers = () => {
  const {suggestedUsers} = useSelector(store=>store.auth);
  return (
    <div className="w-full rounded-2xl">
      <Swiper
        modules={[Autoplay]} 
        spaceBetween={10} 
        slidesPerView={5} 
        slidesPerGroup={1} 
        autoplay={{ delay: 2000 }} 
        loop 
        navigation
        pagination={{ clickable: false }} 
        breakpoints={{
          1024: { slidesPerView: 5 },
          768: { slidesPerView: 3 },
          480: { slidesPerView: 2 },
          0: { slidesPerView: 2 },
        }}
      >
        {
            suggestedUsers?.map((user) => (
                <SwiperSlide key={user._id} className=''>
                  <div className="p-2 backdrop-blur-md bg-white/10 rounded-lg space-y-2 border-1 border-blue-700 ml-2 md:ml-0 max-w-40 md:max-w-none">
                    <div className='my-0.5 flex flex-col items-center gap-3 min-h-50'>
                       <Link href={`/profile/${user._id}`}>
                          <Avatar className="w-17 h-17">
                            <AvatarImage
                              src={user?.profilePicture || 'default_pic.jpg'}
                              alt="Profile_pic"
                            />
                            <AvatarFallback>NC</AvatarFallback>
                          </Avatar>
                       </Link>
                       <div className="text-center">
                         <Link href={`/profile/${user._id}`}><h1 className="font-bold font-serif mx-1">{user?.username}</h1></Link>
                         <span className="text-xs text-slate-400 whitespace-pre-wrap">
                           {user?.bio?.split('\n')[0]?.length > 40
                             ? 'Just getting started on NexaConnect.'
                             : user?.bio?.split('\n')[0] || 'Just getting started on NexaConnect.'}
                         </span>
                       </div>
                       <div className='fixed bottom-3'>
                         <Link href={`/profile/${user._id}`}><Button className='bg-black cursor-pointer border-1 border-blue-700'>
                          View Profile
                         </Button></Link>
                       </div>
                    </div>
                  </div>
                </SwiperSlide>
            )
        )}
      </Swiper>
    </div>
  );
};

export default CarouselSuggestedUsers;