import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from './ui/textarea';
import { readFileAsDataURL } from '@/lib/utils';
import { ArrowRightFromLineIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '@/redux/store';
import { setPosts } from '@/redux/postSlice';
import { Button } from './ui/button';

const CreatePost = ({open, setOpen}) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const{posts} = useSelector(store=>store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async(e)=>{
    const file = e.target.files?.[0];
    if(file){
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }

  const createPostHandler = async(e)=>{
    // console.log(file, caption);
    const formData = new FormData();
    formData.append("caption",caption);
    if(imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/post/addpost`, formData,{
        headers:{
          'Content-Type': 'multipart/form-data'
        },
        withCredentials:true
      });
      if(res.data.success){
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setImagePreview("");
        setCaption("");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      setLoading(false);
    }
  }

  // Add this to remove image from dialog when close without posting
  const handleDialogOpenChange = (isOpen) => {
  // console.log("Dialog open changed:", isOpen);
  setOpen(isOpen);

  if (!isOpen) {
    setImagePreview('');
    setFile(null);
    if (imageRef.current) imageRef.current.value = null;
  }
};
  return (
    // <Dialog open={open} onOpenChange={setOpen}>
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTitle/>
      <DialogContent onInteractOutside={()=> setOpen(false)} className="backdrop-blur-sm bg-white/7 text-white">
        <DialogHeader className="font-bold font-serif text-xl flex justify-center items-center">Create a new post</DialogHeader>
        <div className='flex items-center gap-3'>
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profilePicture || '/default_pic.jpg'} alt='Post_image'/>
              <AvatarFallback>NC</AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className='font-bold font-serif'>{user?.username}</h1>
              <span className='text-slate-400 text-sm whitespace-pre-wrap'>
                {user?.bio?.split('\n')[0]?.length > 40
                  ? 'Just getting started on NexaConnect.'
                  : user?.bio.split('\n')[0] || "Just getting started on NexaConnect."}
              </span>
            </div>
          </div>
          <hr />
          <div className='flex flex-col items-center'>
            <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden'/>
            {
              !imagePreview && (
                <p onClick={()=> imageRef.current.click()} className='text-blue-800 font-black text-lg hover:text-blue-900 cursor-pointer'>Select from device</p>
              )
            }
            {
              imagePreview && (
                <div className='w-full max-h-[300px] flex items-center justify-center overflow-hidden rounded-xl border border-slate-400 shadow-md'>
                  <img src={imagePreview} className="w-full h-full object-cover" alt='preview_post'/>
                </div>
              )
            }
          </div>
          <Textarea value={caption} onChange={(e)=> setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption for your post..."/>
          
          {
            imagePreview && (
              loading ? (
                <Button>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                  Uploading...
                </Button>
              ) : (
              <Button onClick={createPostHandler}>Post<ArrowRightFromLineIcon className='h-5 text-blue-700'/></Button>
              )
            )
          }
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
