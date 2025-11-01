"use client";
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send, SendHorizonal } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { store } from '@/redux/store';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';
import Link from 'next/link';
// import { FaHeart } from 'react-icons/fa';
// import { FaRegHeart } from 'react-icons/fa';
// import { FaRegComment } from 'react-icons/fa'; 

const Post = ({post}) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const {posts} = useSelector(store=>store.post);
  const [like,setLike] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment,setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e)=>{
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText);
    }else{
      setText("");
    }
  }

  const likeOrDislikeHandler = async()=>{
    try {
      const action = like ? 'dislike' : 'like';
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/post/${post._id}/${action}`,{withCredentials:true});
      if(res.data.success){
        const updatedLikes = like ? postLike -1 : postLike +1;
        setPostLike(updatedLikes);
        setLike(!like);

        // updating post data so that it can not change on refresh 
        const updatedPostData = posts.map(p => p._id === post._id ? {
             ...p,
            likes: like ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const commentHandler = async()=>{
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/post/${post._id}/comment`, {text}, {
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      });
      // console.log(res.data);
      if(res.data.success){
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p=>
          p._id === post._id ? {...p, comments: updatedCommentData} : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deletePostHandler = async()=>{
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/post/delete/${post?._id}`,{withCredentials:true});
      if(res.data.success){
        const updatedPostData = posts.filter((postItem)=> postItem?._id !== post?._id);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      
    }
  }

  const bookmarkHandler = async ()=>{
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/post/${post?._id}/bookmark`, {withCredentials:true});
      if(res.data.success){
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // const handleDownload = (imageUrl, filename = 'post-image.jpg') => {  // use it to make new download button to download
  //  const link = document.createElement('a');
  //   link.href = imageUrl;
  //   link.download = filename;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  // onClick={() => handleDownload(post.image, `${post.author.username}-post.jpg`)}

  const handleShare = (post) => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
  
    if (navigator.share) {
      navigator.share({ title: 'Check out this post!', url: postUrl })
        .then(() => console.log('Shared successfully'))
        .catch(err => console.error(err));
    } else {
      navigator.clipboard.writeText(postUrl)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Failed to copy link.'));
    }
  };

  return (
    <div className='bg-black w-full max-w-lg mx-auto p-7 mb-3 md:mb-7 rounded-xl shadow-md border-1 border-slate-500 transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl'>
        <div className='flex items-center justify-between pb-5'>
          <Link href={`/profile/${post?.author._id}`}>
          <div className='flex items-center gap-3'>
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.author?.profilePicture || '/default_pic.jpg'} alt='Post_image'/>
                <AvatarFallback>NC</AvatarFallback>
              </Avatar>
              <div>
                <div className='flex gap-2'>
                  <h1 className='font-bold font-serif'>{post.author?.username}</h1>
                  {
                    user?._id === post.author._id && <Badge>Author</Badge>
                  }
                </div>
                {/* <span className='text-slate-500 text-sm'>{post.author?.bio || "Just getting started on NexaConnect."}</span> */}
                <span className='text-slate-500 text-sm whitespace-pre-wrap'>
                {user?.bio?.split('\n')[0]?.length > 40
                  ? 'Just getting started on NexaConnect.'
                  : user?.bio.split('\n')[0] || "Just getting started on NexaConnect."}
              </span>
              </div>
          </div>
          </Link>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal className='cursor-pointer'/>
              </DialogTrigger>
              <DialogTitle />
              <DialogContent className='bg-black shadow-lg shadow-gray-600 flex flex-col items-center text-center w-fit'>
                {/* <Button variant='ghost' className='cursor-pointer w-fit font-bold font-serif text-[#ED4956] hover:bg-gray-800 hover:text-white transition-all bg-black'>Unfollow</Button> */}
                <Button onClick={bookmarkHandler} variant='ghost' className='cursor-pointer w-fit font-bold font-serif text-white hover:bg-gray-800 hover:text-white transition-all bg-black'>Add to favorites</Button>
                {
                  user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant='ghost' className='cursor-pointer w-fit font-bold font-serif text-white hover:bg-gray-800 hover:text-white transition-all bg-black'>Delete</Button>
                }
              </DialogContent>
            </Dialog>
          </div>
        </div>
      <img 
        // src="./bg.png"
        onDoubleClick={likeOrDislikeHandler}
        src={post.image}
        alt="post_img"
        className="w-full aspect-square object-cover rounded-xl border-1 border-slate-400 shadow-md"
      />

      <div className='flex justify-between my-5'>
        <div className='flex items-center gap-3'>
          {/* <FaRegHeart/>
          <FaRegComment/> */}
          <Heart onClick={likeOrDislikeHandler} className={`h-8 cursor-pointer ${like ? "fill-red-700 stroke-red-700" : "hover:text-red-600"}`}/>
          <MessageCircle 
            onClick={()=> 
              {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }
            } 
            className='h-7 cursor-pointer hover:text-gray-700'
          />
          <Send onClick={() => handleShare(post)}  className='h-6 cursor-pointer hover:text-gray-700'/>
        </div>
        <Bookmark onClick={bookmarkHandler} className='h-7 cursor-pointer hover:text-gray-700'/>
      </div>
      <span className='font-medium block mb-2'>{postLike} likes</span>
      <p>
        <span className='mr-2 font-bold font-serif'>{post.author?.username}</span>
        <span className='text-slate-200'>{post.caption}</span>
      </p>
      {
        comment.length === 0 ? (
          <span 
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }} 
            className='text-gray-400 text-sm'>
            No comments
          </span>
        ) : (
          <span 
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }} 
            className='text-gray-400 text-sm'>
            {comment.length === 1 
              ? 'View 1 comment' 
              : `View all ${comment.length} comments`}
          </span>
        )
      }

      <CommentDialog open={open} setOpen={setOpen}/>
      <div className='flex items-center justify-between'>
        <input type='text' placeholder='Add a comment...' value={text} onChange={changeEventHandler} className='outline-none text-sm w-full'/>
        {
          text && <SendHorizonal onClick={commentHandler} className='h-5 text-blue-700'/>
        }
      </div>
    </div>
  )
}

export default Post
