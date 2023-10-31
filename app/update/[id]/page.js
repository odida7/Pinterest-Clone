'use client'

import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

export default function page({params}) {
    const imageRef = useRef();
    const [user, setUser] = useState([]);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();
    const {data: session, status} = useSession();

    console.log(session?.user)  

    if (status === "unauthenticated") {
    router?.push("/login");
     }

    const onImageChange = (event) => {
     if (event.target.files && event.target.files[0]) {
       const img = event.target.files[0];
       setImage(img); 
       setImageUrl(URL.createObjectURL(img));
    }
  };

    const userId = session?.user?._id;
    console.log('userid:', userId)
 
    const id = params?.id;
    console.log('paramuser:', id)

  ///////////fetch user
    useEffect(() => {
     
        axios.get(`/api/user/${id}`).then((response)=>{
            setUser(response.data);
            console.log(response.data);
          });
             
  }, []);




////////////updata User
const handleSubmit = async (e) => {
    e.preventDefault();
   

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'pinterest');

    try {
        const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dfh89obzs/image/upload', {
            method: 'POST',
            body: formData
        });

        const cloudinaryData = await cloudinaryResponse.json();
        const imageUrl = cloudinaryData.secure_url;
        console.log(imageUrl)

        const userData = {
            image: imageUrl,
            name:  e.target[1].value, 
            proffession: e.target[2].value,
        }

        if (id) {
            const res = await axios.put(`/api/user/${id}`, userData);  
            e.target.reset();
             
            if (res.status === 200) {
                router?.push(`/profile/${id}`);
            }
        } 

    } catch (err) {
        console.error(err);
        setError(err.message);
    }
}






  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='mt-2 text-xl sm:text-4xl'>Edit your profile</h1>

      <form
        onSubmit={handleSubmit}
        className='p-14 flex flex-col gap-8 relative justify-center rounded-lg m-8 border-2 border-slate-100'
      >
        <div className='flex flex-row items-center justify-center gap-8 m-2'>
            <div>
              {image? (
                <img
                 src={imageUrl}
                 alt=''
                 width={120}
                 height={120}
                 className='object-cover rounded-full'
                />
              )
               : ( user?.image? 
               <Image src={user?.image} alt='profile-pic' width={120} height={120} className='object-cover rounded-full'/> 
               :
               <Image src='/assets/images/noAvatar.png' alt='profile-pic' width={120} height={120} className='object-cover rounded-full'/>
               )          
             }
              
            </div>

            <input 
               type='file'
               name='image'
               accept='image/*'
               ref={imageRef}
               onChange={onImageChange}
               className='invisible absolute'
            />
            <span 
              onClick={() => {
                 imageRef.current.click();
                 }}
              className='hover:bg-gray-700 hover:text-white bg-gray-300 text-gray-700 rounded-full p-2 px-8'
            >
              Change
            </span>
        </div>

        <div className='flex flex-col gap-2'>

            <label className='text-sm text-slate-600 font-light'>Username</label>

            <input 
             name='name'
             defaultValue={user?.name}
             placeholder={user?.name || 'Username'}
             className='p-2 border-2 border-slate-400 outline-none bg-transparent rounded-md'
            />
        </div>

        <div className='flex flex-col gap-2'>

            <label className='text-sm text-slate-600 font-light'>Proffession</label>

            <textarea
            name='proffession'
            defaultValue={user?.proffession}
            placeholder='Who are you'
            cols='40'
            rows='5'
            className='border-2 border-slate-400 outline-none bg-transparent rounded-md p-2'
            />
        </div>
        
        <div className='flex flex-col items-center justify-center'>
          <button type='submit' className='bg-blue-400 w-full'>
            Update
          </button>

          <Link href={`/delete/${session?.user?._id}`} className='w-full flex flex-col items-center justify-center'>
            <button 
             className='bg-red-500 w-full'
            >
              Delete Account
            </button>
          </Link>
        </div>
        {error && error.message}
          
      </form>
    </div>
  )
}
