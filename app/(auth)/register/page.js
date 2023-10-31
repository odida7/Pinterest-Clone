'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function page() { 
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try{
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  
        },
        body: JSON.stringify({
          name,
          email, 
          password,
        }), 
         
      });
      res.status === 201 && router.replace('/login?success=Account has been created');

    }catch(err){
      setError(err);
      console.log(err);
    }

  }



  return (
    <div className='flex flex-col items-center justify-center m-3'>
      
        <h1 className='title text-center'>Register and discover Great Arts & <br/> <span>Ideas from Amazing</span>  <br/> <span> Artists All Over The World </span></h1>

      <div className='flex flex-col items-center justify-center m-2 shadow-xl shadow-gray-400 rounded-md'>
     
       <form 
        onSubmit={handleSubmit}
        className='flex flex-col items-center justify-center m-2 p-4 shadow-xl bg-slate-300 w-full rounded-sm'
       >
         <input 
           type='text' 
           placeholder='Username' 
           required
           className='m-4 border-b-2 p-2 bg-transparent outline-none'
        />

         <input 
           type='email' 
           placeholder='Email' 
           required
           className='m-4 border-b-2 p-2 bg-transparent outline-none'
        />

         <input 
           type='password' 
           placeholder='Enter password' 
           required
           className='m-4 mb-6 border-b-2 p-2 bg-transparent outline-none'
        />
      
        
         {error && 'Something went wrong!'}
         <button type='submit bg-blue-400'>
          Register
        </button> 
       </form>

      <div className='flex flex-col items-center justify-between m-2 p-4'>

        
        <span className='text-xs font-light text-gray-400'>Already have an account? <Link href='/login' className='text-sm font-medium text-blue-400'>LogIn</Link> </span>
       </div> 
      </div>
    </div>
  )
}

export default page;
