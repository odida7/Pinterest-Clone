'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getAllUsers } from '@utils/api'; 
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';



export default function Post({data}) {

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
 


  ////////fetch users
 useEffect(() => {
    const fetchUsers = async () => {
      const userData = await getAllUsers();
      setUsers(userData);
    }
    fetchUsers();
  }, []);

 ////////fetch post
  useEffect(() => {
    axios.get('/api/post/Posts').then((response) => {
      setPosts(response.data);
      console.log('allPosts:', response.data);
    });
  }, []);

  


  return (
    <div className='wrap mt-4 items-center justify-center'>
      
     
      <div className="lg:columns-4 columns-2 md:columns-3 xl:columns-5 gap-0 w-full space-y-8 mx-auto p-2 items-center justify-center">

        

          {posts?.map((post) => {
            const user = users.find(u => u._id === post?.userId); // Find the user associated with the post

            return (
              
              <div key={post?.id} className='img-container w-40 sm:w-60'>
                <div className='w-full h-auto rounded-lg overflow-hidden'>
                  <Link href={`/post/${post?._id}`}>
                    {post?.text && <p className='flex flex-col text-center'> {post?.text}</p>}
                    {post?.image && <Image src={post?.image} alt='post' width={250} height={200} className='object-cover' />} 
                  </Link>
                </div>

                <div className='flex flex-row items-center justify-between px-4'>
                  <div className='flex flex-row items-center justify-between gap-1'>

                <Link href={`/profile/${user?._id && user?._id}`}>
                    
                    {user?.image 
                      ? <Image src={user?.image} alt='profile-pic' width={22} height={22} className='object-cover rounded-full overflow-hidden w-8 h-8' />
                      : <Image src='/assets/images/noAvatar.png' alt='profile-pic' width={22} height={22} className='object-cover rounded-full w-8 h-8' />
                    }
                    </Link>
                    {user && <span className='sm:text-sm text-xs text-slate-700'>{user?.name}</span>}
                  </div>

                  <div className='flex flex-row items-center gap-2'>
                    <div className='flex flex-row items-center justify-center gap-1 sm:text-sm text-xs text-slate-700'>
                      <Image src='/assets/images/like.svg' width={18} height={18} alt='like' />{post?.likes?.length}
                    </div>

                    <div className='flex flex-row items-center justify-center gap-1 sm:text-sm text-xs text-slate-700'>
                      <Image src='/assets/images/comments.svg' width={18} height={18} alt='like' />{post?.comments?.length}
                    </div>
                  </div>
                </div> 
              </div> 
            );
          })} 
           
      </div>
     
    </div>
  )
}
