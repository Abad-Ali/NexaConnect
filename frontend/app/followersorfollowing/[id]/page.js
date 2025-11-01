'use client'
import LeftSideBar from '@/components/LeftSideBar'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { ArrowLeft, Edit, MessageCircle, MoreVertical } from 'lucide-react'
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
    <div className='h-screen overflow-hidden'>
      <LeftSideBar />
      <div className="md:pl-[calc(30vw+3.5rem)] max-w-7xl mx-auto text-white md:mt-5">
        <section className='flex justify-between items-center w-full backdrop-blur-md bg-white/10 p-2 md:rounded-2xl'>
            <div className='flex items-center gap-3'>
              <Link href={`/profile/${userProfile?._id}`}>
                 <ArrowLeft className="w-7 h-7 mr-1" />
              </Link>
              <Link href={`/profile/${userProfile?._id}`}>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={userProfile?.profilePicture || '/default_pic.jpg'} alt="Profile_pic"/>
                  <AvatarFallback>
                    NC
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Link href={`/profile/${userProfile?._id}`}><h1 className='font-bold font-serif text-sm'>{userProfile?.username}</h1>
                <span className='text-xs text-slate-500 whitespace-pre-wrap'>
                  {userProfile?.bio?.split('\n')[0]?.length > 40
                  ? 'Just getting started on NexaConnect.'
                  : userProfile?.bio.split('\n')[0] || "Just getting started on NexaConnect."}
                </span>
              </Link>
            </div>
            {
              userProfile._id === user._id? (
                <Link href='/acount/edit'><Edit className='mr-2'/></Link>
              ) : (
                <Link href={window.innerWidth > 1024 ? '/chat' : `/chat/${userProfile._id}`}><MessageCircle className='mr-3'/></Link>
              )
            }
        </section>

        <section className='md:my-3 mt-5 mb-3'>
            <div className='flex justify-evenly items-center'>
                <h1 onClick={()=>setActiveTab('followers')} className={`font-semibold text-lg cursor-pointer ${activeTab === 'followers'  ? 'underline underline-offset-3' : 'text-slate-500'}`}><span className='text-2xl font-semibold'>{userProfile.followers.length}</span> followers</h1>
                <h1 onClick={()=>setActiveTab('following')} className={`font-semibold text-lg cursor-pointer ${activeTab === 'following'  ? 'underline underline-offset-3' : 'text-slate-500'}`}><span className='text-2xl font-semibold'>{userProfile.following.length}</span> following</h1>
            </div>
            <hr className='my-2 border-gray-600'/>

               <div className='h-[70vh] md:h-[75vh] overflow-y-auto scrollable w-full items-center py-2'>
                 {userList.length > 0 ? (
                   userList.map(user => (
                      <div key={user._id} className="mb-3 backdrop-blur-md bg-white/10 p-3 rounded-xl mx-2">
                        <div className='flex justify-between items-center'>
                          <div className='flex items-center gap-3'>
                            <Avatar className="w-11 h-11 cursor-pointer">
                              <AvatarImage src={user.profilePicture || '/default_pic.jpg'} alt={user.username} />
                              <AvatarFallback>NC</AvatarFallback>
                            </Avatar>
                            <div>
                              <Link href={`/profile/${user._id}`}><h2 className="font-semibold">{user.username}</h2></Link>
                              <span className='text-xs text-slate-500 whitespace-pre-wrap'>
                                 {user?.bio?.split('\n')[0]?.length > 40
                                 ? 'Just getting started on NexaConnect.'
                                 : user?.bio.split('\n')[0] || "Just getting started on NexaConnect."}
                               </span>
                            </div>
                          </div>
                          <div>
                            <Dialog>
                            <DialogTrigger>
                              <MoreVertical className='cursor-pointer'/>
                            </DialogTrigger>
                            <DialogTitle/>
                            <DialogContent className='backdrop-blur-md bg-white/5 text-white w-fit md:ml-[30vw]'>
                              <Link href={`/profile/${user._id}`}><Button className='cursor-pointer font-semibold font-sans'>Visti Profile</Button></Link>
                              <Link href={window.innerWidth > 1024 ? '/chat' : `/chat/${user._id}`}><Button className='cursor-pointer font-semibold font-sans px-2'>Message Now</Button></Link>
                            </DialogContent>
                          </Dialog>
                          </div>
                       </div>
                      </div>
                   ))
                 ) : (
                   <p className='text-center text-gray-400 mt-10'>No {activeTab} to show.</p>
                 )}
               </div>
        </section>
      </div>
    </div>
  )
}

export default Followersorfollowing
