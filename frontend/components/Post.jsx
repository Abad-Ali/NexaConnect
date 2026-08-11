"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Heart, MessageCircle, MoreVertical, Send, SendHorizonal }from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { store } from "@/redux/store";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import Link from "next/link";
// import { FaHeart } from 'react-icons/fa';
// import { FaRegHeart } from 'react-icons/fa';
// import { FaRegComment } from 'react-icons/fa';

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [like, setLike] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = like ? "dislike" : "like";
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/post/${post._id}/${action}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        const updatedLikes = like ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLike(!like);

        // updating post data so that it can not change on refresh
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: like
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p,
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      // console.log(res.data);
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p,
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/post/delete/${post?._id}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id,
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/post/${post?._id}/bookmark`,
        { withCredentials: true },
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      navigator
        .share({ title: "Check out this post!", url: postUrl })
        .then(() => console.log("Shared successfully"))
        .catch((err) => console.error(err));
    } else {
      navigator.clipboard
        .writeText(postUrl)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link."));
    }
  };

  return (
<div className="w-full max-w-xl lg:max-w-[560px] mx-auto mb-3 overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-lg shadow-black/20 transition-all duration-300 hover:border-slate-700">
  <div className="flex items-center justify-between px-4 py-4 sm:px-5">
    <Link href={`/profile/${post?.author?._id}`} className="min-w-0 flex-1">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11 shrink-0 ring-2 ring-slate-800">
          <AvatarImage src={post?.author?.profilePicture || "/default_pic.jpg"} alt={`${post?.author?.username || "User"} profile`} className="object-cover" />
          <AvatarFallback className="bg-slate-800 text-sm font-semibold">{post?.author?.username?.slice(0, 2).toUpperCase() || "NC"}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="max-w-[180px] truncate text-sm font-bold sm:text-base">{post?.author?.username}</h1>

            {user?._id === post?.author?._id && (
              <Badge variant="secondary" className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                Author
              </Badge>
            )}
          </div>

          <span className="block max-w-[230px] truncate text-xs text-slate-500 sm:max-w-xs">
            {post?.author?.bio?.split("\n")[0]?.length > 40
              ? "Just getting started on NexaConnect."
              : post?.author?.bio?.split("\n")[0] || "Just getting started on NexaConnect."}
          </span>
        </div>
      </div>
    </Link>

    <Dialog>
      <DialogTrigger asChild>
        <button type="button" aria-label="Post options" className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer">
          <MoreVertical className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-slate-800 bg-white/10 p-3 shadow-2xl shadow-black/50">
        <DialogTitle className="sr-only">Post options</DialogTitle>

        <div className="flex flex-col gap-1">
          <Button onClick={bookmarkHandler} variant="ghost" className="h-11 w-full justify-center rounded-xl font-medium text-white hover:bg-slate-900 cursor-pointer">
            Add to favorites
          </Button>

          {user && user?._id === post?.author?._id && (
            <Button onClick={deletePostHandler} variant="ghost" className="h-11 w-full justify-center rounded-xl font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer">
              Delete post
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  </div>

  <div className="relative w-[300px] md:w-[450px] h-[300px] md:h-[450px] overflow-hidden bg-slate-950 flex items-center justify-center aspect-square sm:aspect-[4/5] lg:aspect-[4/5]">
    <img onDoubleClick={likeOrDislikeHandler} src={post?.image} alt="Post" className="h-full w-full object-cover cursor-pointer transition-transform duration-500 hover:scale-[1.01]" />
  </div>

  <div className="px-4 pt-4 sm:px-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <button type="button" onClick={likeOrDislikeHandler} aria-label={like ? "Unlike post" : "Like post"} className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-900 active:scale-90 cursor-pointer">
          <Heart className={`h-[25px] w-[25px] transition-colors ${like ? "fill-red-600 stroke-red-600" : "stroke-white hover:stroke-red-500"}`} />
        </button>

        <button
          type="button"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          aria-label="View comments"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-900 active:scale-90 cursor-pointer"
        >
          <MessageCircle className="h-[24px] w-[24px] hover:stroke-slate-300" />
        </button>

        <button type="button" onClick={() => handleShare(post)} aria-label="Share post" className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-900 active:scale-90 cursor-pointer">
          <Send className="h-[22px] w-[22px] hover:stroke-slate-300" />
        </button>
      </div>

      <button type="button" onClick={bookmarkHandler} aria-label="Save post" className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-900 active:scale-90 cursor-pointer">
        <Bookmark className="h-[23px] w-[23px]" />
      </button>
    </div>

    <div className="mt-2">
      <span className="text-sm font-semibold text-white">
        {postLike} {postLike === 1 ? "like" : "likes"}
      </span>
    </div>

    <div className="mt-2 text-sm leading-6">
      <span className="mr-2 font-semibold text-white">{post?.author?.username}</span>
      <span className="break-words text-slate-300">{post?.caption}</span>
    </div>

    <button
      type="button"
      onClick={() => {
        dispatch(setSelectedPost(post));
        setOpen(true);
      }}
      className="mt-2 block text-left text-sm text-slate-500 transition-colors hover:text-slate-300 cursor-pointer"
    >
      {comment.length === 0
        ? "No comments"
        : comment.length === 1
          ? "View 1 comment"
          : `View all ${comment.length} comments`}
    </button>

    <div className="mt-4 flex items-center gap-3 border-t border-slate-900 py-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={user?.profilePicture || "/default_pic.jpg"} alt="Your profile" className="object-cover" />
        <AvatarFallback className="bg-slate-800 text-xs">{user?.username?.slice(0, 2).toUpperCase() || "ME"}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 items-center rounded-full bg-slate-900/70 px-4 py-2 focus-within:bg-slate-900 focus-within:ring-1 focus-within:ring-slate-700">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              commentHandler();
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
        />

        {text.trim() && (
          <button type="button" onClick={commentHandler} aria-label="Post comment" className="ml-2 shrink-0 text-blue-500 transition-colors hover:text-blue-400 active:scale-90 cursor-pointer">
            <SendHorizonal className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  </div>

  <CommentDialog open={open} setOpen={setOpen} />
</div>
  );
};

export default Post;
