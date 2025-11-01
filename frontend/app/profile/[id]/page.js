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
import { AtSign, Bookmark, BookmarkXIcon, CameraIcon, Heart, LayoutGrid, Loader2, LogOutIcon, MessageCircle, Settings, User } from 'lucide-react'
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
    <div className='h-screen'>
      <div className='inline md:hidden'>
        <Header />
      </div>
      <LeftSideBar />

      <div className="pt-4 px-4 md:pl-[calc(30vw+3.5rem)] lg:pl-[calc(22%+3.5rem)] max-w-7xl mx-auto text-white mt-10 md:mt-0">
        {/* Profile Header */}
        <div className='text-white grid grid-cols-2 items-center py-10 mt-3 md:mt-0'>
          <section className='flex flex-col justify-center items-center cursor-pointer'>
            <Avatar className="w-28 md:w-40 h-28 md:h-40">
              <AvatarImage src={userProfile?.profilePicture || '/default_pic.jpg'} alt="Profile_pic" />
              <AvatarFallback>NC</AvatarFallback>
            </Avatar>
            <div className='mt-3 mb-1'>
              <span className='font-bold font-serif text-xl md:text-2xl'>{userProfile?.name || "No Name"}</span>
            </div>
            <span className="text-xs md:text-sm text-slate-500">
              Joined on {new Date(userProfile?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </section>

          <section>
            <div className='flex flex-col justify-center'>
              <div className='flex md:gap-5 gap-3'>
                <h1 className='font-bold font-serif text-2xl md:text-3xl'>{userProfile?.username}</h1>
                {isLoggedInUserProfile ? (
                  <Badge className="h-7 hidden md:inline pt-1">Owner</Badge>
                ) : (
                  <Badge className="h-7 hidden md:inline pt-1">Member</Badge>
                )}
                {isLoggedInUserProfile && (
                  <div className='flex items-center'>
                    <Dialog>
                      <DialogTrigger>
                        <Settings className='cursor-pointer h-6 w-6' />
                      </DialogTrigger>
                      <DialogContent className='w-fit backdrop-blur-md bg-white/5 flex flex-col items-center justify-center'>
                        <div className='w-fit h-fit text-slate-400 font-bold flex items-center gap-1'>
                          <Settings className='h-4 w-4' />Settings
                        </div>
                        <Button onClick={logoutHandler} className='cursor-pointer'><LogOutIcon />Logout</Button>
                        <Link href='/acount/edit'>
                          <Button className='cursor-pointer'><User />Edit Profile</Button>
                        </Link>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
              <span className='text-xs md:text-sm text-slate-500'>NexaConnect-Innovate the Way You Connect</span>
            </div>

            {/* Stats */}
            <div className='flex mt-3 mb-7 gap-3 hover:cursor-pointer'>
              <p className='text-xs md:text-sm font-semibold'>
                <span className='text-lg md:text-2xl font-bold'>{userProfile?.posts.length}</span> Posts
              </p>
              <Link href={`/followersorfollowing/${userProfile._id}`}>
                <p className='text-xs md:text-sm font-semibold'>
                  <span className='text-lg md:text-2xl font-bold'>{userProfile?.followers.length}</span> Followers
                </p>
              </Link>
              <Link href={`/followersorfollowing/${userProfile._id}`}>
                <p className='text-xs md:text-sm font-semibold'>
                  <span className='text-lg md:text-2xl font-bold'>{userProfile?.following.length}</span> Following
                </p>
              </Link>
            </div>
            <span className='text-xs md:text-sm text-slate-200 font-semibold whitespace-pre-wrap'>{userProfile?.bio || "Just getting started on NexaConnect."}</span>
          </section>
        </div>

        {/* Action Buttons */}
        <section className='flex justify-center items-center gap-3 py-4'>
          {isLoggedInUserProfile ? (
            <>
              <Link href={`/acount/edit`}>
                <Button className='hover:cursor-pointer px-7 py-3'>Edit Profile</Button>
              </Link>
              <Button onClick={() => setOpen(true)} className='hover:cursor-pointer px-7 py-3'>Add New Post</Button>
              <CreatePost open={open} setOpen={setOpen} />
            </>
          ) : (
            isFollowing ? (
              <>
                <Button onClick={handleFollow} className='hover:cursor-pointer px-7 py-3'>Unfollow</Button>
                <Link href={`/chat/${userProfile?._id}`}>
                  <Button className='hover:cursor-pointer px-7 pb-3 inline md:hidden'>Message</Button>
                </Link>
                <Link href={"/chat"}>
                  <Button className='hover:cursor-pointer px-7 pb-3 hidden md:inline'>Message</Button>
                </Link>
              </>
            ) : (
              <Button onClick={handleFollow} className='hover:cursor-pointer bg-blue-700 px-36 lg:px-64 hover:bg-blue-800 py-3'>Follow</Button>
            )
          )}
        </section>

        {/* Tabs */}
        <div className='flex justify-center items-center mt-7 mb-3 gap-30'>
          <LayoutGrid onClick={() => setActiveTab('posts')} className={`cursor-pointer text-gray-700 ${activeTab === 'posts' ? 'font-bold text-white' : ''}`} />
          {isLoggedInUserProfile && (
            <Bookmark onClick={() => setActiveTab('bookmarks')} className={`cursor-pointer text-gray-700 ${activeTab === 'bookmarks' ? 'font-bold text-white' : ''}`} />
          )}
        </div>
        <hr />

        {/* Posts */}
        <div className={`grid grid-cols-3 gap-2 my-5 ${displayedPosts.length >= 1 ? 'pb-20 md:pb-0' : ''}`}>
          {displayedPosts?.map(post => (
            <div key={post._id} className='relative group cursor-pointer rounded-sm overflow-hidden mb-5'>
              <Image onClick={() => openDialog(post)} src={post.image} alt='postimage' className='rounded-sm w-full aspect-square object-cover' />
              <div className='absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
                <div className='flex items-center text-gray-200 space-x-4'>
                  <Button className='flex items-center gap-2 hover:text-slate-700 font-bold bg-transparent hover:bg-transparent'>
                    <Heart className='fill-white' />
                    <span>{post?.likes.length ?? 0}</span>
                  </Button>
                  <Button className='flex items-center gap-2 hover:text-slate-700 bg-transparent hover:bg-transparent'>
                    <MessageCircle className='fill-white' />
                    <span>{post?.comments.length ?? 0}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
          <DialogTitle />
          <DialogContent className='bg-transparent shadow-none border-none text-white p-0 m-0 w-auto max-w-none pt-8 px-5'>
            {selectedPost && <SinglePost postId={selectedPost._id} />}
          </DialogContent>
        </Dialog>

        {/* Empty state */}
        {displayedPosts.length === 0 && (
          <div className='flex flex-col justify-center items-center w-full pb-7'>
            <div className='p-2 border-3 border-gray-500 rounded-full w-fit cursor-pointer'>
              {activeTab === 'posts' ? <CameraIcon className='h-7 w-7 md:h-10 md:w-10 text-gray-500' /> : <BookmarkXIcon className='h-10 w-10 text-gray-500' />}
            </div>
            <div className='flex flex-col items-center'>
              <h2 className='text-xl md:text-3xl font-bold font-sans'>{activeTab === 'posts' ? 'No shared photos' : 'No bookmarks to show'}</h2>
              <span className='text-xs md:text-sm'>{activeTab === 'posts' ? 'When you share photos, they will appear on your profile.' : 'When you add bookmarks, they will appear on your profile.'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
