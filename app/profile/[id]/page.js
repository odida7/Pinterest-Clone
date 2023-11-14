'use client'

import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function page({params}) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [follow, setFollow] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();

   if (status === "unauthenticated") {
    router?.push("/login");
  }

  const id = params?.id;
  console.log('u:', id)

  const userId = session?.user?._id;
  console.log('userId:', userId)

  const currentUser = session?.user;
  console.log('user:', currentUser)
 

//////////////////fetch post
  useEffect(() => {
          axios.get(`/api/post/userPost/${id}`).then((res)=>{
            setUserPosts(res.data);
            console.log('res', res.data);
          });      
  }, []);


 

///////////fetch user
    useEffect(() => {
     
        axios.get(`/api/user/${id}`).then((response)=>{
            setUser(response.data);
            console.log(response.data);
          });
             
  }, []);


  //////////////follow
  const follower = user?.followers?.includes(userId);
  console.log('followers', follower);

  const handleFollow = async () => {

  try {
 
    const response = await fetch(`/api/user/follow/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
       
 
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error('Error:', response.status);
    }
  
  } catch (error) {
    console.error('Error:', error.message);
  }
};

 
  return (
    <div>
     

        <div className='flex flex-col items-center justify-center m-2 p-2'>
          <div>
            {user?.image? 
             <Image src={user?.image} alt='profile-pic' width={150} height={150} className='object-cover rounded-full w-48 h-48'/> 
             :
             <Image src='/assets/images/noAvatar.png' alt='profile-pic' width={150} height={150} className='object-cover rounded-full w-48 h-48'/> 
             }
          </div>
 
          <span className='p-4 text-3xl font-light'>
            {user.name} 
          </span>  

          <span className='text-lg font-light'>
            {user.proffession} 
          </span>   
         
          <div className='flex flex-row p-2 gap-4 text-sm text-gray-600'>
            <span>Followers: {user?.followers?.length} </span>
            <span>Following: {user?.following?.length} </span>
            <span>Pin: {userPosts.length}</span>
          </div>

          <div>
            {userId === id 
             ? <Link href={`/update/${userId}`}>
                  <button 
                  className='bg-black rounded-full px-4 border border-black hover:bg-white hover:text-black font-light flex flex-row items-center gap-1'
                  > 

                    Edit <Image src='/assets/images/edit-alt.svg' width={18} height={18} alt='like' />
                  </button>
             </Link> 
             :  <button 
                   className='bg-black rounded-full px-4 border-2 border-white hover:bg-white hover:text-black font-light hover:border-black'
                   onClick={handleFollow}
                  >
                    { follower ? 'Unfollow' : 'Follow' }
                
                 </button>
               
               
             
            }

          </div>
         
      </div>
 <div className='wrap mt-4 items-center justify-center'>

      <div className="lg:columns-4 columns-2 md:columns-3 xl:columns-5 gap-0 w-full space-y-8 mx-auto p-2 items-center justify-center">
        {userPosts?.length > 0 && userPosts.map((post) => (
          <div key={post.id} className='img-container w-40 sm:w-60'>
            <div className='w-full h-auto rounded-lg overflow-hidden'>
              <Link href={`/post/${post?._id}`}>
                {post.text && <p className='flex flex-col text-center'> {post.text}</p>}
                {post.image && <Image src={post.image} alt='post' width={250} height={200} className='object-cover' />}
              </Link>
            </div>
            
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

