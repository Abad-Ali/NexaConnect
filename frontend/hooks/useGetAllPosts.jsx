'use client';
import { setPosts } from '@/redux/postSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

const useGetAllPosts = () => {
    const dispatch = useDispatch();
  useEffect(()=>{
    const fetchAllPost = async()=>{
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/post/all`, {withCredentials:true});
            if(res.data.success){
                // console.log(res.data);
                dispatch(setPosts(res.data.posts));            }
        } catch (error) {
            console.log(error);
        }
    }

    fetchAllPost();
  },[]);
};

export default useGetAllPosts;
