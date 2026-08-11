"use client";
import LeftSideBar from "@/components/LeftSideBar";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Edit,
  MessageCircleReply,
  SendHorizonal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "@/components/ui/input";
import Messages from "@/components/Messages";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const Chat = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth,
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);

  // making input tag to work without clicking again and again
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedUser]);

  // const isOnline = true;
  const dispatch = useDispatch();
  const router = useRouter();

  const sendMessageHandler = async (receiverId) => {
    try {
      // console.log("Sending message:", textMessage);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(setSelectedUser(null)); // Clear on mount
  }, [dispatch]);

  // For makeing it to run different on click according to screen size.
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    const checkScreen = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // Tailwind's lg = 1024px
    };

    checkScreen(); // Initial check on mount
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  const handleClick = (user) => {
    if (isLargeScreen) {
      dispatch(setSelectedUser(user));
    } else {
      router.push(`/chat/${user._id}`);
    }
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden text-white">
      <LeftSideBar />
    
      <main className="flex min-h-0 min-w-0 flex-1 pb-24 md:pb-0 md:pl-[calc(30vw+3rem)] lg:pl-[25vw]">
        <div className="flex min-h-0 min-w-0 flex-1">
          <aside className="flex min-h-0 w-full flex-col border-r border-white/10 lg:w-[360px] lg:shrink-0 xl:w-[400px]">
            <div className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-5">
              <div className="mb-4">
                <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
                <p className="mt-1 text-xs text-zinc-500">Connect and chat with people on NexaConnect.</p>
              </div>
    
              <div className="flex items-center justify-between">
                <Link href={`/profile/${user?._id}`} className="flex min-w-0 cursor-pointer items-center gap-3">
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border border-white/10">
                      <AvatarImage src={user?.profilePicture || "/default_pic.jpg"} alt="Profile picture" className="object-cover" />
                      <AvatarFallback>{user?.username?.slice(0, 2)?.toUpperCase() || "NC"}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-emerald-500" />
                  </div>
    
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold">{user?.username || "No name set"}</h2>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                      {user?.bio?.split("\n")[0]?.length > 40 ? "Just getting started on NexaConnect." : user?.bio?.split("\n")[0] || "Just getting started on NexaConnect."}
                    </p>
                  </div>
                </Link>
    
                <Link href="/acount/edit" className="ml-2 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors hover:text-white">
                  <Edit className="h-4 w-4" />
                </Link>
              </div>
            </div>
    
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Suggested people</h2>
                <span className="text-[11px] text-zinc-600">{suggestedUsers?.length || 0}</span>
              </div>
    
              <div className="scrollable min-h-0 flex-1 overflow-y-auto px-3 pb-4">
                {suggestedUsers?.length > 0 ? (
                  suggestedUsers.map((suggestedUser) => {
                    const isOnline = onlineUsers.includes(suggestedUser._id);
                    const isSelected = selectedUser?._id === suggestedUser._id;
    
                    return (
                      <div
                        key={suggestedUser._id}
                        onClick={() => handleClick(suggestedUser)}
                        className={`group my-1 flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 transition-colors duration-150 ${isSelected ? "border border-white/10" : "border border-transparent hover:border-white/10"}`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Link href={`/profile/${suggestedUser?._id}`} onClick={(e) => e.stopPropagation()} className="relative shrink-0 cursor-pointer">
                            <Avatar className="h-12 w-12 border border-white/10">
                              <AvatarImage src={suggestedUser?.profilePicture || "/default_pic.jpg"} alt="Profile picture" className="object-cover" />
                              <AvatarFallback>{suggestedUser?.username?.slice(0, 2)?.toUpperCase() || "NC"}</AvatarFallback>
                            </Avatar>
                            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black ${isOnline ? "bg-emerald-500" : "bg-zinc-600"}`} />
                          </Link>
    
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold">{suggestedUser?.username}</h3>
                            <p className="mt-0.5 truncate text-xs text-zinc-500">
                              {suggestedUser?.bio?.split("\n")[0]?.length > 40 ? "Just getting started on NexaConnect." : suggestedUser?.bio?.split("\n")[0] || "Just getting started on NexaConnect."}
                            </p>
                          </div>
                        </div>
    
                        <div className="ml-2 shrink-0">
                          {isOnline ? (
                            <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              Online
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-600">Offline</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                    <MessageCircleReply className="mb-3 h-9 w-9 text-zinc-600" />
                    <h3 className="text-sm font-semibold text-zinc-400">No suggestions yet</h3>
                    <p className="mt-1 max-w-[220px] text-xs leading-5 text-zinc-600">People you may want to connect with will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
    
          {selectedUser ? (
            <section className="flex min-h-0 min-w-0 flex-1 flex-col">
              <header className="flex h-[73px] shrink-0 items-center gap-3 border-b border-white/10 px-4 sm:px-5">
                <button
                  type="button"
                  onClick={() => dispatch(setSelectedUser(null))}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors hover:text-white"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
    
                <Link href={`/profile/${selectedUser?._id}`} className="group flex min-w-0 cursor-pointer items-center gap-3">
                  <div className="relative shrink-0">
                    <Avatar className="h-11 w-11 border border-white/10">
                      <AvatarImage src={selectedUser?.profilePicture || "/default_pic.jpg"} alt="Profile picture" className="object-cover" />
                      <AvatarFallback>{selectedUser?.username?.slice(0, 2)?.toUpperCase() || "NC"}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black ${onlineUsers.includes(selectedUser._id) ? "bg-emerald-500" : "bg-zinc-600"}`} />
                  </div>
    
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold group-hover:text-blue-400">{selectedUser?.username}</h2>
                    <p className="mt-0.5 text-xs text-zinc-500">{onlineUsers.includes(selectedUser._id) ? "Active now" : "Offline"}</p>
                  </div>
                </Link>
              </header>
    
              <div className="min-h-0 flex-1">
                <Messages selectedUser={selectedUser} />
              </div>
    
              <div className="shrink-0 border-t border-white/10 p-3 sm:p-4">
                <div className="mx-auto flex max-w-5xl items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={textMessage}
                    onChange={(e) => setTextMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && textMessage?.trim()) {
                        e.preventDefault();
                        sendMessageHandler(selectedUser._id);
                        setTextMessage("");
                      }
                    }}
                    type="text"
                    className="h-12 flex-1 rounded-xl border border-white/10 px-4 text-sm font-medium placeholder:text-zinc-600 focus-visible:border-white/20 focus-visible:ring-0"
                    placeholder={`Message ${selectedUser?.username || "user"}...`}
                  />
    
                  <button
                    type="button"
                    onClick={() => {
                      if (!textMessage?.trim()) return;
                      sendMessageHandler(selectedUser._id);
                      setTextMessage("");
                    }}
                    disabled={!textMessage?.trim()}
                    className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 text-blue-500 transition-colors hover:border-blue-500/40 hover:text-blue-400 disabled:cursor-not-allowed disabled:text-zinc-700"
                    aria-label="Send message"
                  >
                    <SendHorizonal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <section className="hidden flex-1 lg:flex lg:items-center lg:justify-center">
              <div className="flex max-w-sm flex-col items-center px-6 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-3xl bg-blue-500/10 blur-2xl" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.035] shadow-2xl">
                    <MessageCircleReply className="h-10 w-10 text-blue-400/70" />
                  </div>
                </div>
    
                <h2 className="text-xl font-bold tracking-tight">Your messages</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Select someone from the list and start a conversation. Your messages will appear here.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;
