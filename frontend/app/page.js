'use client';
import { Button } from "@/components/ui/button";
import Feed from "@/components/Feed";
import Header from "@/components/Header";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import useGetAllPosts from "@/hooks/useGetAllPosts";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

export default function Home() {
  useGetAllPosts();
  useGetSuggestedUsers();
  return (
    <div className="text-white overflow-hidden">
      {/* md:bg-[url('/bg.png')] */}
      <div className="flex h-full">
        {/* Header */}
        <div className="inline md:hidden">
          <Header/>
        </div>
        
        {/* Sidebar */}
        <div className="md:w-[250px] shrink-0">
          <LeftSideBar />
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto px-4 scroll-hide">
          <Feed />
        </div>

        {/* Right Sidebar */}
        <div className="md:w-[300px] shrink-0 hidden lg:inline">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
}