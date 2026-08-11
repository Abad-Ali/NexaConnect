"use client";
import { Input } from "@/components/ui/input";
import LeftSideBar from "@/components/LeftSideBar";
import React, { useState } from "react";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import CarouselSuggestedUsers from "@/components/CarouselSuggetedUser";

const Search = () => {
  const [isActive, setIsActive] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  // console.log(search)
  const searchHandler = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/user/search`,
        {
          params: { username: search },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        // console.log("User found:", res.data.user);
        setUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div className="min-h-screen bg-black text-white">
    <LeftSideBar />
    <main className="min-h-screen pt-20 pb-24 px-4 sm:px-6 md:pt-10 md:pb-10 md:pl-[calc(30vw+3.5rem)] lg:pl-[calc(22%+3.5rem)] max-w-7xl mx-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Find people</h1>
          <p className="text-sm text-slate-500 mt-1">Search for people and discover new connections.</p>
        </div>
        <div className="w-full max-w-4xl flex items-center gap-2 p-1.5 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl focus-within:border-blue-500/40 transition-all">
          <SearchIcon className="ml-3 h-5 w-5 text-slate-500 shrink-0" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsActive(e.target.value.length > 0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchHandler();
              }
            }}
            placeholder="Search username..."
            className="flex-1 h-11 border-none bg-transparent text-white placeholder:text-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button onClick={searchHandler} className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <SearchIcon className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
        {isActive && (
          <div className="mt-5 max-w-4xl">
            {user ? (
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.08] transition">
                <Link href={`/profile/${user._id}`} className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={user?.profilePicture || "/default_pic.jpg"} alt="Profile" />
                    <AvatarFallback>NC</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h2 className="font-bold truncate">{user.username}</h2>
                    <p className="text-xs text-slate-500 truncate">{user?.bio?.split("\n")?.[0] || "New to NexaConnect"}</p>
                  </div>
                </Link>
                <Link href={`/profile/${user._id}`} className="shrink-0">
                  <Button size="sm" className="rounded-xl bg-white/10 border border-white/10 hover:bg-blue-600 cursor-pointer">
                    View Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.03] text-center">
                <SearchIcon className="mx-auto h-7 w-7 text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">No user found</p>
              </div>
            )}
          </div>
        )}
        <section className="mt-10">
          <CarouselSuggestedUsers />
        </section>
      </div>
    </main>
  </div>
  );
};
export default Search;
