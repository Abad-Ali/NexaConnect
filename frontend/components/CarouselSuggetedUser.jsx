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
    <section className="w-full overflow-hidden py-2">
      <div className="mb-4 flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-bold text-white md:text-xl">People you may know</h2>
          <p className="mt-1 text-xs text-slate-500">Discover people on NexaConnect</p>
        </div>
      </div>
    
      <Swiper
        modules={[Autoplay]}
        spaceBetween={12}
        slidesPerView={2}
        slidesPerGroup={1}
        autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop={suggestedUsers?.length > 5}
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 10 },
          480: { slidesPerView: 2.2, spaceBetween: 12 },
          640: { slidesPerView: 3, spaceBetween: 12 },
          768: { slidesPerView: 3, spaceBetween: 14 },
          1024: { slidesPerView: 4, spaceBetween: 16 },
          1280: { slidesPerView: 5, spaceBetween: 16 },
        }}
      >
        {suggestedUsers?.map((user) => {
          const bio = user?.bio?.split("\n")?.[0]?.trim() || "New to NexaConnect";
    
          return (
            <SwiperSlide key={user._id}>
              <div className="group relative my-2 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-950/20">
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-blue-600/10 blur-2xl transition-all duration-300 group-hover:bg-blue-600/20" />
    
                <div className="relative flex flex-col items-center text-center">
                  <Link href={`/profile/${user._id}`}>
                    <Avatar className="h-16 w-16 border-2 border-slate-700 ring-4 ring-black/20 transition-all duration-300 group-hover:border-blue-500 md:h-[72px] md:w-[72px]">
                      <AvatarImage src={user?.profilePicture || "/default_pic.jpg"} alt={`${user?.username || "User"} profile`} />
                      <AvatarFallback className="bg-blue-950 text-blue-300">NC</AvatarFallback>
                    </Avatar>
                  </Link>
    
                  <Link href={`/profile/${user._id}`} className="mt-3 max-w-full">
                    <h3 className="max-w-[140px] truncate text-sm font-bold text-white transition-colors group-hover:text-blue-400 md:text-base">{user?.username}</h3>
                  </Link>
    
                  <p className="mt-1 min-h-[32px] w-full line-clamp-2 px-1 text-[11px] leading-4 text-slate-500 md:text-xs">
                    {bio.length > 45 ? `${bio.slice(0, 45)}...` : bio}
                  </p>
    
                  <Link href={`/profile/${user._id}`} className="mt-4 w-full">
                    <Button size="sm" className="h-9 w-full cursor-pointer rounded-xl border border-blue-500/30 bg-blue-600/10 text-xs font-semibold text-blue-400 transition-all hover:border-blue-500 hover:bg-blue-600 hover:text-white">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    
      <div className="mt-3 flex justify-center md:hidden">
        <span className="text-[10px] text-slate-600">Swipe to discover more</span>
      </div>
    </section>
  );
};

export default CarouselSuggestedUsers;