"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { MoreHorizontal, SendHorizontal, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const [comment, setComment] = useState([]);
  const [sending, setSending] = useState(false);

  const { selectedPost, posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost?.comments || []);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (text.trim() && !sending) {
        sendCommentHandler();
      }
    }
  };

  const sendCommentHandler = async () => {
    if (!text.trim() || !selectedPost?._id || sending) {
      return;
    }

    try {
      setSending(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/post/${selectedPost._id}/comment`,
        {
          text: text.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];

        setComment(updatedCommentData);

        const updatedPostData = posts.map((post) =>
          post._id === selectedPost._id
            ? {
                ...post,
                comments: updatedCommentData,
              }
            : post
        );

        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Comment error:", error);

      toast.error(error?.response?.data?.message || "Failed to add comment");
    } finally {
      setSending(false);
    }
  };

  const handleDialogChange = (value) => {
    setOpen(value);

    if (!value) {
      setText("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTitle className="sr-only">Post Comments</DialogTitle>

      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="w-full h-[100dvh] max-w-none p-0 m-0 rounded-none border-0 bg-[#090909] text-white overflow-hidden flex flex-col md:w-[90vw] md:max-w-5xl md:h-[85vh] md:rounded-2xl md:border md:border-white/10"
      >
        <div className="w-full shrink-0 bg-black hidden md:flex items-center justify-center h-[38vh] md:w-[55%] md:h-full md:absolute md:left-0 md:top-0">
          {selectedPost?.image && (
            <img src={selectedPost.image} alt="Post" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="flex flex-col min-h-0 flex-1 bg-[#090909] md:ml-[55%] md:w-[45%]">
          <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10">
            <Link
              href={`/profile/${selectedPost?.author?._id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 min-w-0"
            >
              <Avatar className="w-9 h-9 shrink-0 border border-white/10">
                <AvatarImage src={selectedPost?.author?.profilePicture || "/default_pic.jpg"} alt="Profile" />
                <AvatarFallback>NC</AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{selectedPost?.author?.username}</p>
                <p className="text-xs text-gray-500 truncate max-w-[220px]">
                  {selectedPost?.author?.bio || "Sharing moments on NexaConnect"}
                </p>
              </div>
            </Link>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <MoreHorizontal size={20} />
                </button>
              </DialogTrigger>

              <DialogContent className="w-[calc(100%-32px)] max-w-[300px] bg-[#090909] border border-white/10 rounded-2xl p-2">
                <DialogTitle className="sr-only">Post options</DialogTitle>

                <div className="flex flex-col gap-1">
                  <Link href={`/profile/${selectedPost?.author?._id}`} onClick={() => setOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-11 rounded-xl text-white hover:bg-white/10 hover:text-white"
                    >
                      View Profile
                    </Button>
                  </Link>

                  {selectedPost?.author?._id === user?._id ? (
                    <Link href={`/post/${selectedPost?._id}`} onClick={() => setOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-11 rounded-xl text-white hover:bg-white/10 hover:text-white"
                      >
                        View Full Post
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/chat" onClick={() => setOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-11 rounded-xl text-white hover:bg-white/10 hover:text-white"
                      >
                        Message
                      </Button>
                    </Link>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 [scrollbar-width:thin] [scrollbar-color:#555_transparent]">
            {comment.length === 0 ? (
              <div className="min-h-full flex flex-col items-center justify-center text-center text-gray-500">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-3">
                  <SendHorizontal size={20} className="text-gray-600" />
                </div>

                <p className="text-sm font-medium text-gray-400">No comments yet</p>
                <p className="text-xs mt-1 text-gray-600">Be the first to comment.</p>
              </div>
            ) : (
              comment.map((item) => <Comment key={item._id} comment={item} />)
            )}
          </div>

          <div className="shrink-0 w-full border-t border-white/10 p-3 bg-[#090909] pb-[calc(12px+env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-3 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 focus-within:border-white/20 transition">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarImage src={user?.profilePicture || "/default_pic.jpg"} alt="Your profile" />
                <AvatarFallback className="text-[9px]">NC</AvatarFallback>
              </Avatar>

              <input
                type="text"
                placeholder="Add a comment..."
                value={text}
                onChange={changeEventHandler}
                onKeyDown={handleKeyDown}
                disabled={sending}
                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-gray-600"
              />

              {text.trim() && (
                <button
                  type="button"
                  disabled={sending}
                  onClick={sendCommentHandler}
                  className="shrink-0 text-blue-500 hover:text-blue-400 disabled:opacity-50 transition cursor-pointer"
                >
                  {sending ? <Loader2 size={19} className="animate-spin" /> : <SendHorizontal size={19} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;