'use client'

import { getAllUsers } from '@utils/api';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function page({params}) {

  const [post, setPost] = useState([]);
  const [commens, setCommens] = useState([]);
 // const [postLike, setPostLike] = useState([]);
  const router = useRouter();
  //const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);
  const { data: session, status } = useSession();

   if (status === "unauthenticated") {
    router?.push("/login");
  }
 
  const id = params?.id; 
  console.log('paramId:', id)

  const userId = session?.user?._id;
  console.log('userId:', userId)

  const currentUser = session?.user;
  console.log('user:', currentUser)




  /////////////////////////////////////////Fetch post 
      useEffect(() => {
     
        axios.get(`/api/post/${id}`).then((response)=>{
            setPost(response.data);
            console.log('post:',  response.data);
          });
             
  }, []);

 


  /////////////////////////////////////////////////Fetch users 
  useEffect(() => {
    const fetchUsers = async () => {
      const userData = await getAllUsers();
      setUsers(userData);
     
    }
    fetchUsers();
  }, [])




  ////////////////////////////////////////////like post

  const handleLike = async () => {
  try {
    if (id) {
      const res = await axios.put(`/api/post/like/${id}`, { userId, post });
      
      // Assuming `data.likes` contains the updated like count
      setPost(prevPost => ({ ...prevPost, likes: res.data.likes }));
    }
  } catch (err) {
    console.error(err);
  }
};



      //////////////////////////////////////////// create comments
   const handleComment = async (e) => {
  e.preventDefault();
  const conversation = e.target[0].value;

  try {
    const res = await fetch(`/api/post/comments/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: userId,
        postId: id,
        conversation,
      }),
    });
     
    if (res.ok) {
      const newComment = await res.json();

      // Update the comments state with the new comment
      setCommens([...commens, newComment]);
    }
    

    e.target.reset();
  } catch (err) {
    console.error(err);
  }
};




  ///////////////////////////fetch comment
useEffect(() => {
  const getComments = async () => {
    try {
      const response = await fetch(`/api/post/comments/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error:', response.status);
        return;
      }

      const commentsData = await response.json();      

      // Sort the comments in ascending order based on timestamp
      commentsData.sort((a, b) => a.timestamp - b.timestamp);

      console.log('Comments:', commentsData);
      setCommens(commentsData);

      

    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  getComments();
}, []);


  ////////////////////////////////////////////comment like post
/*
  const commentId = commens._id;
    console.log('comId:', commentId)

  const handleCommentLike = async () => {
  try {
    if (id) {
      const res = await axios.put(`/api/post/comments/like/${id}`, { userId, commentId });
      
      // Assuming `data.likes` contains the updated like count
      setPost(prevPost => ({ ...prevPost, likes: res.data.likes }));
    }
  } catch (err) {
    console.error(err);
  }
};

*/



const user = users.find(u => u._id === post.userId); // Find the user associated with the post

  return (
    <div className='flex flex-col items-center justify-center relative'>
     
              <div 
                className='m-2 flex flex-col md:flex-row rounded-lg overflow-hidden w-full sm:2/4 bg-white shadow-xl shadow-gray-400'
               >

              {/****************** Left side */}
              <div className='md:w-1/2 w-full bg-slate-200 items-center justify-center'>
                {post.text && <p className='flex flex-col text-center'> {post.text}</p>}

                {post.image && <Image src={post.image} alt='post' width={300} height={250} className='object-cover items-center rounded-lg w-full' />} 
              </div>

              {/****************** Right side */}
      
             <div className='flex flex-col p-1 md:p-4 sm:gap-2 gap-1 md:w-1/2 w-full bg-white'>
              {/****************** top */}
    
           <div className='flex flex-row items-center justify-between'> 

              <div className='flex flex-row sm:gap-4 gap-0 relative items-center'>
                <Link href={`/profile/${user?._id}`}>
                  {user?.image? 
                  <Image src={user?.image} alt='profile-pic' width={38} height={38} className='object-cover rounded-full w-12 h-12'/> 
                  :
                  <Image src='/assets/images/noAvatar.png' alt='profile-pic' width={28} height={28} className='object-cover rounded-full'/> 
                  }
                </Link>
                

                {user && <span className='text-md text-slate-700 invisible sm:visible sm:relative absolute'>{user?.name}</span>}
             </div>

             <div>
                {userId === user?._id 
             ? <Link href={`/postUpdate/${id}`}>
                  <button 
                  className='rounded-full px-2 border-1 border-black bg-white flex flex-row items-center gap-1'
                  >
                    <Image src='/assets/images/edit-alt.svg' width={18} height={18} alt='like' />
                  </button>
             </Link> 
             :  <span 
                   className='rounded-full px-2 border-1 border-black'
                >
                <Image src='/assets/images/dots.svg' width={22} height={22} alt='like' />
                </span>
            }
             </div>
           </div>

       {/****************** mid */}

         <div className='overflow-y-auto w-full max-h-40'> 
          {post.desc && <p className='flex flex-col text-slate-700 text-md'># {post.desc}</p>}
         </div>
          

          
       {/********************************************************* bottom */}



         <div className='flex flex-col'>
            <div className='flex flex-row items-center justify-between p-2'>
              <div className='flex flex-row gap-2 items-center'>
                <span className='text-slate-700 text-sm font-semibold'>
                  Comments
                </span>
                <span className='text-slate-500 text-xs font-light'>
                  {commens.length}
                </span>
              </div>
             
              

              <div className='flex flex-row items-center' >
                <button 
                 className='p-1 rounded-full text-xs font-light hover:bg-slate-200 text-slate-500 bg-transparent'
                 onClick={handleLike}
                >
                  <Image src='/assets/images/like.svg' width={18} height={18} alt='like' />
                </button>
                <span className='text-slate-500 text-xs font-light'>
                  {post?.likes?.length}
                </span>
                
              </div>
            </div>
       
           {/******************************************display comments */}
          <div className='overflow-auto max-h-80'>
          
           {commens.length === 0 && (
             <span className='text-sm text-slate-500 font-light'>
             No comments yet, add your comments here
             </span>
            )}
           
            {commens?.map((comment)=>{
              const user = users.find(u => u._id === comment.author)
              return (
                <div key={comment._id}>                 
                  <div className='flex flex-row gap-2 p-1'>
                    <Link href={`/profile/${user?._id && user?._id}`}>
                     {user?.image 
                       ? <Image src={user?.image} alt='profile-pic' width={16} height={16} className='object-cover rounded-full overflow-hidden w-6 h-6' />
                      : <Image src='/assets/images/noAvatar.png' alt='profile-pic' width={16} height={16} className='object-cover rounded-full w-6 h-6' />
                      }
                  </Link>
                  <div className='flex flex-col gap-0'>
                    {comment.conversation && <p className='text-sm text-slate-700 font-light'>{comment.conversation}</p>}

                    <div className='flex flex-row'>
                      <button 
                      className='p-1 rounded-full text-xs font-light hover:bg-slate-200 text-slate-500 bg-transparent'>Reply</button>

                      <div className='flex flex-row items-center gap-0'>
                        <button
                         // onClick={handleCommentLike}
                          className='p-0 rounded-full text-xs hover:bg-slate-200 font-light text-slate-500 bg-transparent'
                        >
                          Likes
                        </button>
                        <span className='text-xs font-light text-slate-500'>{comment?.likes?.length}</span>
                      </div>
                      
                    </div>
                    
                  </div> 
                    
                  </div>
                </div>
              )
            })}
           
             
          </div>
             
         </div>
          
            <form onSubmit={handleComment} className='w-full md:w-3/4 flex flex-row items-center'>
              <input type="text" name="conversation" placeholder='Write a comment' className='p-2 rounded-lg bg-gray-200 outline-none text-slate-700 text-sm'/>
              <button type='submit' className='rounded-lg p-2 bg-gray-200 hover:bg-gray-500 text-sm text-slate-700'>
                send
              </button>
            </form>
            
          

        </div>
        

      </div>
    </div>
  )
}
