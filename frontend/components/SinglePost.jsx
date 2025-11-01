import React from 'react';
import { useSelector } from 'react-redux';
import Post from './Post';

const SinglePost = ({ postId }) => {
  const { posts } = useSelector((store) => store.post);

  const post = posts.find((p) => p._id === postId);

  if (!post) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Post not found or still loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center md:w-[55vh] md:h-[95vh]">
      <Post post={post} />
    </div>
  );
};

export default SinglePost;
