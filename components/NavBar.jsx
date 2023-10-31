'use client'

import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react';
import ProfilePicture from './ProfilePicture'



export default function NavBar() {
  const {data: session, status} = useSession();
  
  const isAuth = status === 'authenticated';
  const unAuth = status === 'unauthenticated';
  
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  //const userId = session?.user?._id;
  
  return ( 

    <div className='flex flex-row items-center justify-evenly sm:justify-between w-screen m-b-2 p-2 relative'>
      <div className='flex flex-row items-center justify-between gap-2 mx-2 sm:gap-4 sm:mx-4'>
        <span className='text-xl font-semibold text-slate-500'>
          <Link href='/'>
            <h2 className='text-white text-2xl font-md bg-red-600 p-1 rounded-full'>Pin</h2>
          </Link>  
        
        </span>
 

       {isAuth && <ProfilePicture/>}
      </div>


      <div className='flex flex-row items-center gap-0 mx-0 sm:gap-2 sm:mr-2'>
        {isAuth && 
          <Link href='/createPost'>
            <span 
            className='bg-black border-2 border-black text-white hover:text-black rounded-full hover:bg-white p-1 sm:p-2 text-sm sm:text-md '
            >
              Create
            </span>
          </Link>  
        }

        <form className='bg-slate-100 rounded-full absolute sm:relative sm:visible invisible'>
          <input type="text" placeholder='search...' className='bg-transparent outline-none p-2 text-slate-700'/>
        </form>

        <div>
          {unAuth &&
          <span className='text-md font-light bg-red-600 hover:bg-gray-100 p-1 sm:p-2 rounded-full text-white hover:text-black'>
           
            <Link href='/login'>
             Signin
            </Link>
            
          </span>
          }


        {isAuth &&
          <button 
           onClick={()=> signOut({redirect: false})}
           className='bg-slate-100 text-sm font-light text-slate-500 p-1 sm:p-2 hover:bg-red-600 hover:text-white rounded-full'
          >
            LogOut
          </button>
          }
        </div>
      </div>
      
    </div>
   

  )
}
