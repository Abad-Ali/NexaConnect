"use client";
import { Bell } from "lucide-react";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clearLikeNotifications } from "@/redux/rtnSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);
  const dispatch = useDispatch();

  return (
    <header className="fixed top-0 left-0 right-0 z-10 w-full h-14 bg-black px-4 flex items-center justify-between shadow-md border-b border-slate-500 rounded-lg">
      <div className="flex items-center">
        <div className="flex items-center">
          <img src="/logo_icon.png" alt="Logo Icon" className="h-10" />
          <h1 className="font-bold font-sans text-gray-200 text-lg">NexaConnect</h1>
        </div>
        {/* <img src="/textLogo.png" alt="Text Logo" className="h-20" /> */}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative cursor-pointer">
            <Bell className="h-5 w-5 text-white" />
            {likeNotification.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {likeNotification.length}
              </span>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="end"
          className="mt-[4vh] bg-black shadow-lg rounded-md w-72 p-4 space-y-2 text-white border-1 border-slate-500"
        >
          <div className="flex flex-col justify-between ">
            <span className="font-semibold font-sans">Notifications</span>
            <div className="w-full h-[1px] bg-slate-500 my-2"></div>
            <div className="flex justify-end">
              {
                likeNotification.length > 0 && (
                  <span
                    onClick={() => dispatch(clearLikeNotifications())}
                    className="text-xs text-gray-400 hover:text-gray-200 cursor-pointer">
                    Clear All
                  </span>
                )
              }
            </div>
          </div>

          {likeNotification.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">
              No new notifications
            </p>
          ) : (
            likeNotification.map((notification) => (
              <div
                key={notification.userId}
                className="cursor-pointer flex items-center space-x-3 p-2 hover:bg-gray-950 rounded-md transition"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      notification?.userDetails?.profilePicture ||
                      "/default_pic.jpg"
                    }
                    alt="Profile picture"
                  />
                  <AvatarFallback>NC</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <span className="font-bold">
                    {notification.userDetails?.username}
                  </span>{" "}
                  liked your post
                </div>
              </div>
            ))
          )}
        </PopoverContent>
      </Popover>
    </header>
  );
};

export default Header;
