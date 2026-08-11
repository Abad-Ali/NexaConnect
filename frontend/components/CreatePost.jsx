import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from './ui/textarea';
import { readFileAsDataURL } from '@/lib/utils';
import { ArrowRightFromLineIcon, Loader2, PlusSquare } from 'lucide-react';
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
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTitle />
    
      <DialogContent onInteractOutside={() => setOpen(false)} className="w-[calc(100%-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-black/90 border border-slate-700 text-white rounded-2xl p-5 sm:p-6 scrollable">
        <DialogHeader className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-center">Create a new post</h2>
          <p className="text-xs text-gray-400 text-center mt-1">Share a moment with your friends</p>
        </DialogHeader>
    
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={user?.profilePicture || "/default_pic.jpg"} alt="Profile picture" />
            <AvatarFallback>NC</AvatarFallback>
          </Avatar>
    
          <div className="min-w-0">
            <h1 className="font-bold font-serif truncate">{user?.username || "NexaConnect User"}</h1>
            <span className="text-slate-400 text-xs sm:text-sm line-clamp-1">
              {user?.bio?.split("\n")?.[0]?.length > 40
                ? "Just getting started on NexaConnect."
                : user?.bio?.split("\n")?.[0] || "Just getting started on NexaConnect."}
            </span>
          </div>
        </div>
    
        <hr className="border-slate-700 mb-5" />
    
        <div className="flex flex-col items-center mb-4">
          <input ref={imageRef} onChange={fileChangeHandler} type="file" accept="image/*" className="hidden" />
    
          {!imagePreview ? (
            <button type="button" onClick={() => imageRef.current?.click()} className="w-full aspect-video sm:aspect-[4/3] rounded-xl border-2 border-dashed border-slate-600 hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-200 flex flex-col items-center justify-center gap-2  text-gray-400 hover:text-blue-400 cursor-cell">
              <PlusSquare className="h-8 w-8" />
              <span className="font-semibold text-sm sm:text-base">Select from device</span>
              <span className="text-xs text-gray-500">JPG, PNG or WEBP</span>
            </button>
          ) : (
            <div className="relative w-full">
              <div className="w-full aspect-square max-h-[55vh] rounded-xl overflow-hidden border border-slate-600 bg-black shadow-lg">
                <img src={imagePreview} className="w-full h-full object-contain" alt="Post preview" />
              </div>
    
              <button type="button" onClick={() => imageRef.current?.click()} className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-slate-600 text-xs font-semibold hover:bg-black transition">
                Change image
              </button>
            </div>
          )}
        </div>
    
        <div className="space-y-1">
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={500}
            className="min-h-[90px] resize-none bg-white/5 border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-600 placeholder:text-gray-500 rounded-xl"
            placeholder="Write a caption for your post..."
          />
    
          <div className="flex justify-end">
            <span className="text-[11px] text-gray-500">{caption.length}/500</span>
          </div>
        </div>
    
        {imagePreview && (
          <div className="flex gap-3 mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading} className="flex-1 border-slate-700 bg-transparent text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer">
              Cancel
            </Button>
    
            {loading ? (
              <Button disabled className="flex-1 bg-blue-600 opacity-80">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </Button>
            ) : (
              <Button type="button" onClick={createPostHandler} className="flex-1 bg-blue-600 hover:bg-blue-700 font-semibold cursor-pointer">
                Post
                <ArrowRightFromLineIcon className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
