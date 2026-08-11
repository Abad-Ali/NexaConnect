"use client";

import { Bell, Home, MessageCircle, Plus, Search, UserRound, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./CreatePost";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from "@radix-ui/react-popover";
import { clearLikeNotifications } from "@/redux/rtnSlice";
import Link from "next/link";

const LeftSideBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);

  const [open, setOpen] = useState(false);

  const navigate = (path) => {
    router.push(path);
  };

  const handleNavigation = (text) => {
    switch (text) {
      case "Home":
        navigate("/");
        break;
      case "Search":
        navigate("/search");
        break;
      case "Messages":
        navigate("/chat");
        break;
      case "Profile":
        if (user?._id) {
          navigate(`/profile/${user._id}`);
        }
        break;
      case "Create":
        setOpen(true);
        break;
      default:
        break;
    }
  };

  const navItems = [
    {
      text: "Home",
      icon: Home,
    },
    {
      text: "Search",
      icon: Search,
    },
    {
      text: "Create",
      icon: Plus,
    },
    {
      text: "Messages",
      icon: MessageCircle,
    },
  ];

  return (
    <>
      <aside className="hidden md:flex fixed left-4 top-4 bottom-4 z-40 w-[250px] lg:w-[300px] flex-col rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl shadow-black/40 text-white p-4">
        <div className="flex items-center justify-center px-4 py-4">
          <img src="/NexaConnect.png" alt="NexaConnect" className="w-36 h-auto object-contain" />
        </div>

        <div className="h-px bg-white/10 my-3" />

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.text}
                type="button"
                onClick={() => handleNavigation(item.text)}
                className="group relative flex items-center gap-4 w-full px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer text-left"
              >
                <Icon size={22} strokeWidth={1.8} className="transition-transform duration-200 group-hover:scale-110" />
                <span className="text-[15px] font-medium">{item.text}</span>
              </button>
            );
          })}

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="group relative flex items-center gap-4 w-full px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer text-left"
              >
                <div className="relative">
                  <Bell size={22} strokeWidth={1.8} className="transition-transform duration-200 group-hover:scale-110" />

                  {likeNotification?.length > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-black">
                      {likeNotification.length > 99 ? "99+" : likeNotification.length}
                    </span>
                  )}
                </div>

                <span className="text-[15px] font-medium">Notifications</span>
              </button>
            </PopoverTrigger>

            <PopoverPortal>
              <PopoverContent
                side="right"
                align="start"
                sideOffset={25}
                className="w-[340px] max-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-[#090909] text-white shadow-2xl shadow-black/50 p-0 my-3.5"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <div>
                    <h3 className="font-semibold text-base">Notifications</h3>

                    {likeNotification?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {likeNotification.length} new{" "}
                        {likeNotification.length === 1 ? "notification" : "notifications"}
                      </p>
                    )}
                  </div>

                  {likeNotification?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => dispatch(clearLikeNotifications())}
                      className="text-xs text-gray-400 hover:text-white transition cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-[420px] overflow-y-auto p-2">
                  {likeNotification?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                        <Bell size={20} className="text-gray-500" />
                      </div>

                      <p className="text-sm font-medium text-gray-300">
                        No new notifications
                      </p>

                      <p className="text-xs text-gray-600 mt-1">
                        You're all caught up.
                      </p>
                    </div>
                  ) : (
                    likeNotification.map((notification, index) => (
                      <Link
                        key={notification.userId || index}
                        href={`/profile/${notification?.userDetails?._id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] transition"
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage
                            src={notification?.userDetails?.profilePicture || "/default_pic.jpg"}
                            alt="Profile picture"
                          />
                          <AvatarFallback>NC</AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-300 leading-5">
                            <span className="font-semibold text-white">
                              {notification?.userDetails?.username}
                            </span>{" "}
                            liked your post
                          </p>

                          <span className="text-[11px] text-gray-600">
                            New notification
                          </span>
                        </div>

                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      </Link>
                    ))
                  )}
                </div>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </nav>

        <button
          type="button"
          onClick={() => handleNavigation("Profile")}
          className="group flex items-center gap-3 w-full rounded-xl p-3 hover:bg-white/[0.08] transition cursor-pointer text-left"
        >
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarImage src={user?.profilePicture || "/default_pic.jpg"} alt="Profile picture" />
            <AvatarFallback>NC</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate text-white">
              {user?.username || "Profile"}
            </p>

            <p className="text-xs text-gray-500 truncate">
              View your profile
            </p>
          </div>

          <UserRound size={18} className="text-gray-500 group-hover:text-white transition" />
        </button>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[68px] px-3 pb-[env(safe-area-inset-bottom)] bg-black/90 backdrop-blur-xl border-t border-white/10 text-white">
        <div className="h-full flex items-center justify-around">
          <button
            type="button"
            onClick={() => handleNavigation("Home")}
            className="flex flex-col items-center justify-center gap-1 w-16 h-full text-gray-400 hover:text-white transition cursor-pointer"
          >
            <Home size={22} strokeWidth={1.8} />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigation("Search")}
            className="flex flex-col items-center justify-center gap-1 w-16 h-full text-gray-400 hover:text-white transition cursor-pointer"
          >
            <Search size={22} strokeWidth={1.8} />
            <span className="text-[10px]">Search</span>
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-black shadow-lg shadow-white/10 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <Plus size={25} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={() => handleNavigation("Messages")}
            className="flex flex-col items-center justify-center gap-1 w-16 h-full text-gray-400 hover:text-white transition cursor-pointer"
          >
            <MessageCircle size={22} strokeWidth={1.8} />
            <span className="text-[10px]">Messages</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigation("Profile")}
            className="flex flex-col items-center justify-center gap-1 w-16 h-full text-gray-400 hover:text-white transition cursor-pointer"
          >
            <Avatar className="h-6 w-6 border border-white/20">
              <AvatarImage src={user?.profilePicture || "/default_pic.jpg"} alt="Profile picture" />
              <AvatarFallback className="text-[9px]">NC</AvatarFallback>
            </Avatar>

            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </nav>

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSideBar;