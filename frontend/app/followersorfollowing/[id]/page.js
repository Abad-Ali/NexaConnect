'use client'
import LeftSideBar from '@/components/LeftSideBar'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { ArrowLeft, Edit, MessageCircle, MoreVertical, UserPlus, Users } from 'lucide-react'
import { useParams } from 'next/navigation'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import axios from 'axios'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const Followersorfollowing = () => {
    const params = useParams();
    const userId = params.id;
    useGetUserProfile(userId);
    const {userProfile, user} = useSelector(store=>store.auth);
    // console.log(userProfile);
    const [activeTab, setActiveTab] = useState('followers')
    const [userList, setUserList] = useState([]) 
    // console.log(activeTab);

    useEffect(() => {
    const fetchUsers = async (idsArray) => {
      if (!idsArray || idsArray.length === 0) {
        setUserList([])
        return
      }

      try {
        const query = idsArray.join(',')
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/user/users?ids=${query}`, { withCredentials: true })
        if (res.data.success) {
          setUserList(res.data.users)
        } else {
          setUserList([])
        }
      } catch (error) {
        console.error(error);
        setUserList([])
      }
    }

    if (!userProfile) return

    if (activeTab === 'followers') {
      fetchUsers(userProfile.followers)
    } else {
      fetchUsers(userProfile.following)
    }
  }, [activeTab, userProfile])
  return (
    <div className="min-h-screen bg-black text-white">
      <LeftSideBar />
    
      <main className="w-full md:pl-[calc(30vw+3.5rem)] lg:pl-[calc(22%+3.5rem)]">
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-5 md:px-8 py-3 md:py-8">
          <section className="sticky top-0 z-20 mb-4 md:mb-6">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl px-3 sm:px-5 py-3 shadow-lg">
              <div className="flex items-center gap-3 min-w-0">
                <Link
                  href={`/profile/${userProfile?._id}`}
                  className="flex items-center justify-center rounded-full p-1.5 hover:bg-white/10 transition cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
    
                <Link
                  href={`/profile/${userProfile?._id}`}
                  className="flex items-center gap-3 min-w-0 cursor-pointer"
                >
                  <Avatar className="w-10 h-10 sm:w-11 sm:h-11 border border-white/10">
                    <AvatarImage src={userProfile?.profilePicture || "/default_pic.jpg"} alt={userProfile?.username} />
                    <AvatarFallback>NC</AvatarFallback>
                  </Avatar>
    
                  <div className="min-w-0">
                    <h1 className="font-semibold text-sm sm:text-base truncate">
                      {userProfile?.username}
                    </h1>
                    <p className="text-[11px] sm:text-xs text-zinc-500 truncate max-w-[150px] sm:max-w-[300px]">
                      {userProfile?.bio?.split("\n")?.[0]?.length > 40
                        ? "Just getting started on NexaConnect."
                        : userProfile?.bio?.split("\n")?.[0] || "Just getting started on NexaConnect."}
                    </p>
                  </div>
                </Link>
              </div>
    
              {userProfile?._id === user?._id ? (
                <Link
                  href="/acount/edit"
                  className="p-2.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
                >
                  <Edit className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href="/chat"
                  className="p-2.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                </Link>
              )}
            </div>
          </section>
    
          <section className="mb-5 px-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Connections
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              People connected with {userProfile?.username}.
            </p>
          </section>
    
          <section className="mb-5">
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-900 border border-white/10">
              <button
                onClick={() => setActiveTab("followers")}
                className={`relative flex flex-col items-center justify-center rounded-xl py-3 transition-all duration-200 cursor-pointer ${
                  activeTab === "followers" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white"
                }`}
              >
                <span className="text-lg sm:text-xl font-bold">
                  {userProfile?.followers?.length || 0}
                </span>
                <span className="text-xs sm:text-sm">Followers</span>
              </button>
    
              <button
                onClick={() => setActiveTab("following")}
                className={`relative flex flex-col items-center justify-center rounded-xl py-3 transition-all duration-200 cursor-pointer ${
                  activeTab === "following" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white"
                }`}
              >
                <span className="text-lg sm:text-xl font-bold">
                  {userProfile?.following?.length || 0}
                </span>
                <span className="text-xs sm:text-sm">Following</span>
              </button>
            </div>
          </section>
    
          <section>
            <div className="h-[calc(100vh-260px)] min-h-[350px] overflow-y-auto pr-1 scrollable">
              {userList?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userList.map((person) => (
                    <div
                      key={person._id}
                      className="group rounded-2xl border border-white/10 bg-zinc-950 hover:bg-zinc-900 hover:border-white/20 transition-all duration-200 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          href={`/profile/${person._id}`}
                          className="flex items-center gap-3 min-w-0 cursor-pointer"
                        >
                          <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border border-white/10 group-hover:border-white/30 transition">
                            <AvatarImage
                              src={person?.profilePicture || "/default_pic.jpg"}
                              alt={person?.username}
                            />
                            <AvatarFallback>NC</AvatarFallback>
                          </Avatar>
    
                          <div className="min-w-0">
                            <h2 className="font-semibold text-sm sm:text-base truncate group-hover:text-blue-400 transition">
                              {person?.username}
                            </h2>
                            <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">
                              {person?.bio?.split("\n")?.[0]?.length > 40
                                ? "Just getting started on NexaConnect."
                                : person?.bio?.split("\n")?.[0] || "Just getting started on NexaConnect."}
                            </p>
                          </div>
                        </Link>
    
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="shrink-0 p-2 rounded-full hover:bg-white/10 transition cursor-pointer">
                              <MoreVertical className="w-5 h-5 text-zinc-400" />
                            </button>
                          </DialogTrigger>
    
                          <DialogTitle />
    
                          <DialogContent className="w-[90%] max-w-xs rounded-2xl border border-white/10 bg-zinc-950 text-white">
                            <div className="flex flex-col gap-2">
                              <Link href={`/profile/${person._id}`} className="cursor-pointer">
                                <Button
                                  variant="outline"
                                  className="w-full h-11 rounded-xl bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white cursor-pointer"
                                >
                                  View Profile
                                </Button>
                              </Link>
    
                              <Link href="/chat" className="cursor-pointer">
                                <Button
                                  variant="outline"
                                  className="w-full h-11 rounded-xl bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white cursor-pointer"
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Message
                                </Button>
                              </Link>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
    
                      <div className="flex gap-2 mt-4">
                        <Link href={`/profile/${person._id}`} className="flex-1 cursor-pointer">
                          <Button
                            variant="outline"
                            className="w-full h-9 rounded-xl text-xs bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white cursor-pointer"
                          >
                            View Profile
                          </Button>
                        </Link>
    
                        <Link href="/chat" className="flex-1 cursor-pointer">
                          <Button className="w-full h-9 rounded-xl text-xs bg-white text-black hover:bg-zinc-200 cursor-pointer">
                            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                            Message
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-5">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-4">
                    {activeTab === "followers" ? (
                      <Users className="w-7 h-7 text-zinc-500" />
                    ) : (
                      <UserPlus className="w-7 h-7 text-zinc-500" />
                    )}
                  </div>
    
                  <h3 className="font-semibold text-lg">
                    No {activeTab} yet
                  </h3>
    
                  <p className="text-sm text-zinc-500 max-w-xs mt-1">
                    {activeTab === "followers"
                      ? `${userProfile?.username} doesn't have any followers yet.`
                      : `${userProfile?.username} isn't following anyone yet.`}
                  </p>
    
                  <Link href="/" className="cursor-pointer">
                    <Button className="mt-5 rounded-xl px-6 bg-white text-black hover:text-black hover:bg-white/80 cursor-pointer">
                      Discover People
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Followersorfollowing
