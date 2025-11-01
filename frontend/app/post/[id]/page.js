"use client";
import React from "react";
import SinglePost from "@/components/SinglePost";
import LeftSideBar from "@/components/LeftSideBar";
import Header from "@/components/Header";
import RightSideBar from "@/components/RightSideBar";

export default function PostPage({ params }) {
  // unwrap the promise
  const id = React.use(params).id;

  return (
    <div className="flex justify-center min-h-screen bg-black text-white overflow-y-hidden">
      <div className="inline md:hidden">
        <Header/>
      </div>
      <LeftSideBar/>
      <div className="my-17 md:my-5">
        <SinglePost postId={id} />
      </div>
      <RightSideBar/>
    </div>
  );
}

