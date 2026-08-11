'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import LeftSideBar from '@/components/LeftSideBar'
import Header from '@/components/Header'
import CreatePost from '@/components/CreatePost'
import SinglePost from '@/components/SinglePost'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { setAuthUser } from '@/redux/authSlice'
import { followOrUnfollow } from '@/lib/follow'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { AtSign, Bookmark, BookmarkXIcon, CameraIcon, Heart, LayoutGrid, Loader2, LogOutIcon, MessageCircle, Plus, Settings, User } from 'lucide-react'
import Link from 'next/link'
import Image from "next/image";

const Profile = () => {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()

  const userId = params.id

  const { userProfile, user } = useSelector(store => store.auth)

  const [activeTab, setActiveTab] = useState('posts')
  const [open, setOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  // Dialog for posts
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const openDialog = (post) => {
    setSelectedPost(post)
    setIsDialogOpen(true)
  }

  // Fetch profile data
  useGetUserProfile(userId)

  // Determine if viewing own profile
  const isLoggedInUserProfile = user && userProfile ? user._id === userProfile._id : false

  // Update following state whenever user/userProfile changes
  useEffect(() => {
    if (user && userProfile) {
      setIsFollowing(user.following.includes(userProfile._id))
    }
  }, [user, userProfile])

  // Logout handler
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/user/logout`, { withCredentials: true })
      if (res.data.success) {
        dispatch(setAuthUser(null))
        localStorage.removeItem('authUser')
        router.replace('/login')
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Logout failed')
    }
  }

  // Follow/unfollow handler
  const handleFollow = async () => {
    if (!user) return toast.error('Please log in first!')

    const res = await followOrUnfollow(userProfile._id)
    if (res.success) {
      toast.success(res.message)
      setIsFollowing(!isFollowing)

      const updatedFollowing = isFollowing
        ? user.following.filter(id => id !== userProfile._id)
        : [...user.following, userProfile._id]

      dispatch(setAuthUser({ ...user, following: updatedFollowing }))
      localStorage.setItem('authUser', JSON.stringify({ ...user, following: updatedFollowing }))
    } else {
      toast.error(res.message)
    }
  }

  // Show loading if profile not yet loaded
  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen text-white font-semibold font-sans gap-2">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  const displayedPosts = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="md:hidden">
        <Header />
      </div>
    
      <LeftSideBar />
    
      <main className="w-full pt-16 md:pt-6 p-4 sm:px-6 md:pl-[calc(30vw+3.5rem)] lg:pl-[calc(22%+3.5rem)] pb-20">
        <section className="w-full max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-6 md:gap-10 py-8 md:py-10">
            <div className="flex-shrink-0 flex flex-col items-center">
              <Avatar className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 ring-2 ring-slate-700 ring-offset-4 ring-offset-black">
                <AvatarImage src={userProfile?.profilePicture || "/default_pic.jpg"} alt="Profile picture" className="object-cover" />
                <AvatarFallback className="bg-slate-800 text-white text-2xl">NC</AvatarFallback>
              </Avatar>
    
              <div className="font-black font-serif mt-3">{userProfile?.name || "NexaConnect"}</div>
            </div>
    
            <div className="w-full flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 flex-wrap w-full">
                <h1 className="text-2xl sm:text-3xl font-bold break-all">
                  {userProfile?.username || "User"}
                </h1>
    
                <Badge className="text-gray-400 bg-white/10">
                  {isLoggedInUserProfile ? "You" : "Member"}
                </Badge>
    
                {isLoggedInUserProfile && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer">
                        <Settings className="w-5 h-5 text-slate-300" />
                      </button>
                    </DialogTrigger>
    
                    <DialogContent className="w-[90%] max-w-sm bg-zinc-950 border border-slate-700 text-white">
                      <div className="flex items-center justify-start gap-2 text-slate-400 font-semibold">
                        <Settings className="w-4 h-4" />
                        Accounts Settings
                      </div>
    
                      <div className="flex flex-col gap-3 mt-3">
                        <Link href="/acount/edit">
                          <Button className="w-full cursor-pointer">
                            <User className="w-4 h-4" />
                            Edit Profile
                          </Button>
                        </Link>
    
                        <Button onClick={logoutHandler} className="w-full cursor-pointer text-red-400">
                          <LogOutIcon className="w-4 h-4" />
                          Logout
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
    
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                NexaConnect · Innovate the Way You Connect
              </p>
    
              <div className="flex items-center justify-center md:justify-start gap-6 sm:gap-8 mt-5">
                <div className="text-center md:text-left">
                  <p className="text-lg sm:text-xl font-bold">{userProfile?.posts?.length ?? 0}</p>
                  <p className="text-xs text-slate-500">Posts</p>
                </div>
    
                <Link href={`/followersorfollowing/${userProfile?._id}`} className="cursor-pointer">
                  <div className="text-center md:text-left hover:text-blue-400 transition">
                    <p className="text-lg sm:text-xl font-bold">{userProfile?.followers?.length ?? 0}</p>
                    <p className="text-xs text-slate-500">Followers</p>
                  </div>
                </Link>
    
                <Link href={`/followersorfollowing/${userProfile?._id}`} className="cursor-pointer">
                  <div className="text-center md:text-left hover:text-blue-400 transition">
                    <p className="text-lg sm:text-xl font-bold">{userProfile?.following?.length ?? 0}</p>
                    <p className="text-xs text-slate-500">Following</p>
                  </div>
                </Link>
              </div>
    
              <p className="text-sm text-slate-300 mt-5 max-w-md whitespace-pre-wrap break-words">
                {userProfile?.bio || "Just getting started on NexaConnect."}
              </p>
    
              {userProfile?.createdAt && (
                <p className="text-xs text-slate-600 mt-2">
                  Joined{" "}
                  {new Date(userProfile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
    
          <div className="flex items-center justify-center gap-2 sm:gap-3 w-full pb-6">
            {isLoggedInUserProfile ? (
              <>
                <Link href="/acount/edit" className="w-full max-w-[180px] cursor-pointer">
                  <Button variant="secondary" className="w-full font-semibold cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Button>
                </Link>
    
                <Button onClick={() => setOpen(true)} className="w-full max-w-[180px] font-semibold cursor-pointer">
                  <Plus className="w-4 h-4" />
                  <span>New Post</span>
                </Button>
    
                <CreatePost open={open} setOpen={setOpen} />
              </>
            ) : (
              <>
                <Button
                  onClick={handleFollow}
                  className={`w-full max-w-[220px] font-semibold cursor-pointer ${
                    isFollowing ? "bg-zinc-800 hover:bg-zinc-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
    
                <Link href="/chat" className="w-full max-w-[180px] cursor-pointer">
                  <Button variant="secondary" className="w-full font-semibold cursor-pointer">
                    Message
                  </Button>
                </Link>
              </>
            )}
          </div>
    
          <div className="border-t border-slate-800">
            <div className="flex justify-center items-center gap-20 sm:gap-28">
              <button
                onClick={() => setActiveTab("posts")}
                className={`relative py-4 px-4 transition cursor-pointer ${
                  activeTab === "posts" ? "text-white" : "text-slate-600"
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
    
                {activeTab === "posts" && (
                  <span className="absolute top-0 left-0 right-0 h-[2px] bg-white" />
                )}
              </button>
    
              {isLoggedInUserProfile && (
                <button
                  onClick={() => setActiveTab("bookmarks")}
                  className={`relative py-4 px-4 transition cursor-pointer ${
                    activeTab === "bookmarks" ? "text-white" : "text-slate-600"
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
    
                  {activeTab === "bookmarks" && (
                    <span className="absolute top-0 left-0 right-0 h-[2px] bg-white" />
                  )}
                </button>
              )}
            </div>
          </div>
        </section>
    
        <section className="w-full max-w-5xl mx-auto">
          {displayedPosts?.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-4 pb-5">
              {displayedPosts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => openDialog(post)}
                  className="relative aspect-square overflow-hidden bg-zinc-900 cursor-pointer group"
                >
                  <Image
                    src={post.image}
                    alt="Post"
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 30vw, 300px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
    
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1">
                        <Heart className="w-5 h-5 fill-white" />
                        <span className="font-semibold">{post?.likes?.length ?? 0}</span>
                      </div>
    
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-5 h-5 fill-white" />
                        <span className="font-semibold">{post?.comments?.length ?? 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="p-4 border border-slate-700 rounded-full mb-4">
                {activeTab === "posts" ? (
                  <CameraIcon className="w-8 h-8 text-slate-500" />
                ) : (
                  <BookmarkXIcon className="w-8 h-8 text-slate-500" />
                )}
              </div>
    
              <h2 className="text-xl font-bold">
                {activeTab === "posts" ? "No posts yet" : "No bookmarks yet"}
              </h2>
    
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                {activeTab === "posts"
                  ? isLoggedInUserProfile
                    ? "Share your first photo with your friends."
                    : "This user hasn't shared any photos yet."
                  : "Posts you save will appear here."}
              </p>
    
              {isLoggedInUserProfile && activeTab === "posts" && (
                <Button onClick={() => setOpen(true)} className="mt-5 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Create your first post
                </Button>
              )}
            </div>
          )}
        </section>
    
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTitle />
    
          <DialogContent className="bg-transparent shadow-none border-none text-white p-0 m-0 w-auto max-w-none pt-8 px-3 sm:px-5">
            {selectedPost && <SinglePost postId={selectedPost._id} />}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

export default Profile
