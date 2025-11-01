import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { MoreHorizontal, SendHorizonal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'

const CommentDialog = ({open, setOpen}) => {
  const [text, setText] = useState("");
  const { selectedPost, posts} = useSelector(store=>store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();
  const {user} = useSelector(store=>store.auth);
  
  useEffect(()=>{
    if(selectedPost){
      setComment(selectedPost?.comments)
    }
  },[selectedPost]);

  const changeEventHandler = (e)=>{
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText);
    }else{
      setText("");
    }
  }

  const sendCommentHandler = async()=>{
    // alert(text);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/post/${selectedPost._id}/comment`, {text}, {
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      });
      
      if(res.data.success){
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p=>
          p._id === selectedPost._id ? {...p, comments: updatedCommentData} : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle/>
        <DialogContent onInteractOutside={()=> setOpen(false)} className="bg-gray-950 max-w-full h-full p-0 m-0 flex flex-col">
            <div className='flex flex-col'>
                <div className='w-full h-[50vh] flex justify-center items-center'>
                   <img src={selectedPost?.image} alt='post-img'
                      className='w-full h-full object-cover rounded-t-lg'
                   />
               </div>
   
               <div className='w-full flex flex-col justify-between pt-3 text-white'>
                   <div className='flex items-center justify-between p-4'>
                      <div className='flex items-center gap-2'>
                        <Link href=''>
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={selectedPost?.author?.profilePicture ||'/default_pic.jpg'} alt='Post_image'/>
                            <AvatarFallback><img src='./favicon.ico'/></AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className='flex flex-col justify-center'>
                          <Link href="" className='font-bold font-serif'>{selectedPost?.author?.username}</Link> 
                          <span className='text-slate-500 text-xs'>{selectedPost?.author?.bio || "Just getting started on NexaConnect."}</span>
                        </div>
                      </div>

                      <div>
                        <Dialog>
                         <DialogTrigger asChild>
                           <MoreHorizontal className='cursor-pointer'/>
                         </DialogTrigger>
                         <DialogTitle/>
                         <DialogContent className='bg-black shadow-lg shadow-gray-600 flex flex-col items-center text-center'>
                           <Link href={`/profile/${selectedPost?.author._id}`}><Button variant='ghost' className='cursor-pointer w-fit font-bold font-serif text-white hover:bg-gray-800 hover:text-white transition-all bg-black'>
                             View Profile
                           </Button></Link>
                           {
                            selectedPost?.author._id === user?._id ? (
                              <Link href={`/post/${selectedPost._id}`}><Button variant='ghost' className='cursor-pointer w-fit font-bold font-serif text-white hover:bg-gray-800 hover:text-white transition-all bg-black'>
                               Full Post
                              </Button></Link>
                            ) : (
                              <Link href={window.innerWidth > 1024 ? '/chat' : `/chat/${user._id}`}><Button variant='ghost' className='cursor-pointer w-fit font-bold font-serif text-white hover:bg-gray-800 hover:text-white transition-all bg-black'>
                                Message 
                              </Button>
                              </Link>
                            )
                           }
                         </DialogContent>
                        </Dialog>
                      </div>
                   </div>
                   <hr />
                   <div className='h-[28vh] md:h-[30vh] scrollable overflow-y-auto px-4'>
                      {
                        comment.map((comment)=> <Comment key={comment._id} comment={comment}/>)
                      }
                      {/* Comments will be shown  here... */}
                   </div>
                   <div className='fixed bottom-0 left-0 right-0 z-10 flex p-4 backdrop-blur-md bg-white/10 rounded-t-lg'>
                      <input type='text' placeholder='Add a comment...' value={text} onChange={changeEventHandler} className='outline-none text-sm w-full'/>
                      {
                        text && <SendHorizonal disabled={!text.trim()} onClick={sendCommentHandler} className='h-5 text-blue-700'/>
                      }
                   </div>
               </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default CommentDialog
