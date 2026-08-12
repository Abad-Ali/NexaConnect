"use client";
import { LogIn, LogInIcon, LogOut, LogOutIcon, UserRound, UserRoundPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import SuggestedUsers from "./SuggestedUsers";
import Link from "next/link";

const RightSideBar = () => {
  const router = useRouter();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/user/logout`,
        { withCredentials: true },
      );
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        localStorage.removeItem("token");
        router.replace("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const RSidebarHandler = (textType) => {
    if (textType === "LogOut") {
      logoutHandler();
    } else if (textType === "Login with other account?") {
      logoutHandler();
      router.replace("/login");
      toast.success("Welcome to NexaConnect!");
    }
  };

  const sidebarItems = [
    // { icon:(
    // <Avatar className="w-11 h-11">
    //   <AvatarImage src={user?.profilePicture || 'default_pic.jpg'} alt="Profile_pic"/>
    //   <AvatarFallback>
    //     NC
    //   </AvatarFallback>
    // </Avatar>

    // ), text:"AccountName"},
    { icon: <LogOutIcon className="text-red-600" />, text: "LogOut" },
    {
      icon: <LogInIcon className="text-blue-700" />,
      text: "Login with other account?",
    },
  ];

  return (
    <aside className="hidden xl:flex fixed right-4 top-4 bottom-4 z-30 w-[280px] 2xl:w-[300px] flex-col gap-4 text-white">
      <div className="flex-1 min-h-0 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Suggestions for you</h2>
            <p className="text-xs text-gray-500 mt-1">People you may know</p>
          </div>
          <div>
            <UserRoundPlus size={20} />
          </div>
        </div>
    
        <div className="h-px bg-white/10 mx-5" />
    
        <div className="px-3 py-3 overflow-y-hidden h-[calc(100%-50px)]">
          <SuggestedUsers />
        </div>
      </div>
    
      <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl shadow-black/30 p-4">
        <Link href={`/profile/${user?._id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.06] transition group">
          <Avatar className="h-11 w-11 border border-white/10">
            <AvatarImage src={user?.profilePicture || "/default_pic.jpg"} alt="Profile picture" />
            <AvatarFallback>NC</AvatarFallback>
          </Avatar>
    
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold truncate text-white group-hover:text-gray-200">
                {user?.username || "User"}
              </h3>
    
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-medium text-gray-400">
                You
              </span>
            </div>
    
            <p className="text-xs text-gray-500 truncate mt-0.5">View your profile</p>
          </div>
    
          <UserRound size={17} className="text-gray-600 group-hover:text-white transition" />
        </Link>
    
        <div className="h-px bg-white/10 my-3" />
    
        <button type="button" onClick={logoutHandler} className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-500/[0.08] transition cursor-pointer text-left">
          <LogOut size={19} strokeWidth={1.8} className="text-red-500 group-hover:scale-110 transition" />
          <span className="text-sm font-medium">Log out</span>
        </button>
    
        <button type="button" onClick={logoutHandler} className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-blue-500/[0.08] transition cursor-pointer text-left">
          <LogIn size={19} strokeWidth={1.8} className="text-blue-500 group-hover:scale-110 transition" />
          <span className="text-sm font-medium">Switch account</span>
        </button>
      </div>
    </aside>
  );
};
    
export default RightSideBar;