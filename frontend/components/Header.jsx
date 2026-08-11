"use client";

import { Bell, CheckCheck } from "lucide-react";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger, PopoverPortal } from "@radix-ui/react-popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clearLikeNotifications } from "@/redux/rtnSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

const Header = () => {
  const [open, setOpen] = useState(false);

  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );

  const dispatch = useDispatch();

  const notificationCount = likeNotification?.length || 0;

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 w-full h-16 bg-black/90 backdrop-blur-xl border-b border-white/10 text-white px-4 flex items-center justify-between pt-[env(safe-area-inset-top)]">
      <Link href="/" className="flex items-center gap-2 group cursor-pointer">
        <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white/5 border border-white/10">
          <img src="/logo_icon.png" alt="NexaConnect" className="w-8 h-8 object-contain group-hover:scale-105 transition-transform" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-[16px] font-semibold tracking-tight text-white leading-none">
            NexaConnect
          </h1>
          <span className="text-[9px] text-gray-500 mt-1 leading-none">
            Connect & share
          </span>
        </div>
      </Link>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.05] border border-white/10 hover:bg-white/10 active:scale-95 transition cursor-pointer"
          >
            <Bell size={20} strokeWidth={1.8} className="text-gray-200" />

            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 border-2 border-black text-[9px] font-bold text-white flex items-center justify-center">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverPortal>
          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={17}
            className="w-[calc(100vw-24px)] max-w-[360px] max-h-[70vh] overflow-hidden rounded-2xl border border-white/10 bg-[#090909] text-white shadow-2xl shadow-black/50 p-0 outline-none"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <div>
                <h2 className="text-sm font-semibold">Notifications</h2>
                <p className="text-[11px] text-gray-500 mt-1">
                  {notificationCount === 0
                    ? "You're all caught up"
                    : `${notificationCount} new ${
                        notificationCount === 1
                          ? "notification"
                          : "notifications"
                      }`}
                </p>
              </div>

              {notificationCount > 0 && (
                <button
                  type="button"
                  onClick={() => dispatch(clearLikeNotifications())}
                  className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-white transition cursor-pointer"
                >
                  <CheckCheck size={14} />
                  Clear all
                </button>
              )}
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {notificationCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Bell size={20} className="text-gray-600" />
                  </div>

                  <p className="text-sm text-gray-300 font-medium">
                    No new notifications
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    We'll let you know when something happens.
                  </p>
                </div>
              ) : (
                likeNotification.map((notification, index) => (
                  <Link
                    key={notification?.userId || index}
                    href={`/profile/${notification?.userDetails?._id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] active:bg-white/[0.08] transition"
                  >
                    <Avatar className="h-10 w-10 shrink-0 border border-white/10">
                      <AvatarImage
                        src={
                          notification?.userDetails?.profilePicture ||
                          "/default_pic.jpg"
                        }
                        alt="Profile picture"
                      />
                      <AvatarFallback>NC</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-gray-300 leading-5">
                        <span className="font-semibold text-white">
                          {notification?.userDetails?.username}
                        </span>{" "}
                        liked your post
                      </p>

                      <p className="text-[10px] text-gray-600 mt-0.5">
                        New notification
                      </p>
                    </div>

                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  </Link>
                ))
              )}
            </div>
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </header>
  );
};

export default Header;