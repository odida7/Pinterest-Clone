'use client'

import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'

export default function page({params}) {
  const { data: session, status } = useSession();
  const router = useRouter();

    if (status === "unauthenticated") {
    router?.push("/login");
    } 

    const id = params?.id;
    console.log('paramuser:', id)

    /////////////delete user
const handleDelete = async()=> {
   if(id){
   try {
     const del = await axios.delete(`/api/user/${id}`)
     
     if (del.status === 204){
      router?.push("/login");
     }
   }catch (err){
    console.log(err.message);
   }
  }
}


  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='mt-2 text-xl sm:text-4xl'>Delete this Account</h1>


        <div className='p-12 flex flex-col gap-8 relative justify-between rounded-lg m-8 bg-slate-200'>
            <span className='flex flex-col text-center bg-red-100 text-slate-500 rounded-md p-4'>
                Are you sure you want to delete this account?<br/>
                <span className='text-red-600'> Warning, </span> once you go through with this decision you will<br/> lose your account forever.
            </span>

            <div className='flex flex-row m-4 gap-4 items-center justify-center'>
                <button 
                onClick={handleDelete}
                className='bg-gray-800 px-4 hover:bg-red-600'
                >
                    Yes
                </button>

                <Link href={`/profile/${id}`}>
                    <span className='bg-gray-500 hover:bg-blue-500 text-gray-100 p-2 rounded px-4'>
                        No
                    </span>
                </Link>
            </div>
        </div>
      
    </div>
  )
}
