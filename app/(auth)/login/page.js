'use client'

import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Page() { 
 
  const [error, setError] = useState('');
  const session = useSession();
  const router = useRouter(); 
  const params = useSearchParams();
  //const [success, setSuccess] = useState('');

  useEffect(() => {
    setError(params.get("error"));

   // setSuccess(params.get('success'));
  }, [params]);
 

   if (session.status === "authenticated") {
    router?.push("/");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    signIn("credentials", {
      email,
      password,
      callbackUrl: '/',
      redirect: false,
    });
  };


  return (
    <div className='flex flex-col items-center justify-center m-5'>
    
      <h1 className='m-1 text-center text-xl sm:text-4xl'>Login and discover Great Arts &amp; <br/> <span>Ideas from Amazing</span>  <br/> <span> Artists All Over The World </span></h1>
      
      <div className='flex flex-col items-center justify-center m-8 shadow-xl shadow-gray-400 rounded-md'>
        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center m-2 p-4 shadow-xl bg-slate-300 w-full rounded-sm'>
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
          {error && <p className="text-red-500">{error}</p>}

          <button type='submit bg-blue-400'>Login</button>
        </form>

        <div className='flex flex-col items-center justify-between m-2 p-4'>
          <span className='text-xs font-light text-gray-400'>
            Don't have an account yet?{' '}
            <Link href='/register' className='text-sm font-medium text-blue-400'>
              Register
            </Link>
          </span> 
        </div> 
      </div>
    </div>
  );
}

export default Page;
