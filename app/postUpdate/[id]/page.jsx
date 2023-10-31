'use client'

import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

export default function page({params}) {
  const [image, setImage] = useState(null);
  const [post, setPost] = useState([]);
  const imageRef = useRef();
  const router = useRouter();
  const [errors, setErrors] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const { data: session, status } = useSession();


  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setImage(img);
      setImageUrl(URL.createObjectURL(img)); // Save the URL  
    }
  };


  if (status === "unauthenticated") {
    router?.push("/login");
  }

  const userId = session?.user?._id;
    console.log('userid:', userId)
 
    const id = params?.id;
    console.log('paramuser:', id)

    ///Fetch post 
      useEffect(() => {
     
        axios.get(`/api/post/${id}`).then((response)=>{
            setPost(response.data);
            console.log(response.data);
          });
             
  }, []);

  const handleUpdate = async (e) => {  
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

       const postData = {
            image: imageUrl,
            text: e.target[1].value, 
            desc: e.target[2].value,
        }
      
        if (id) {
            const res = await axios.put(`/api/post/${id}`, postData);  
            e.target.reset();
              
            if (res.status === 200) {
                router?.push(`/post/${id}`);
            }
            
            
        } 
    
    } catch (err) {
      console.error(err);
      setErrors(err.message);
    }
  };

    


  return (
    <div className='flex flex-col items-center justify-center relative'>
      <h1 className='mt-2 text-xl sm:text-4xl'>Edit Post</h1>

      <form
        onSubmit={handleUpdate}
        className='p-12 flex flex-col sm:flex-row gap-8 relative justify-between bg-white rounded-lg m-12'
      >
        <input
          type='file' // Use type="file" for file uploads
          name='image'
          ref={imageRef}
          onChange={onImageChange}
          accept='image/*'
          className='invisible absolute'
        />

        {/*******image preview  */}
        <div
          onClick={() => {
            imageRef.current.click();
          }}
          className='bg-gray-200 flex flex-col items-center justify-center w-60 p-8'
        >
          {image ? (
            <img
              src={imageUrl}
              alt=''
              width={200}
              height={200}
              className='object-cover'
            />
          ) : (
            post?.image &&
               <Image src={post?.image} alt='profile-pic' width={200} height={200} className='object-cover'/> 
             
          )}
        </div>  

        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2 items-center'>
            {post?.text && post.text}
            <textarea
              name='text'
              defaultValue={post?.text}
              placeholder='What is new?'
              cols='40'
              rows='5'
              className='border-b-2 border-slate-400 outline-none'
            />
          </div>

          <div className='flex flex-col gap-2 items-center'>
            <textarea
              name='desc'
              placeholder='Change description'
              defaultValue={post?.desc}
              cols='40'
              rows='5'
              className='border-b-2 border-slate-400 outline-none'
            />
          </div>
       
          <div className='flex flex-col items-center justify-center'>
            <button type='submit' className='bg-blue-400 w-full'>
              save
            </button>

            <Link href={`/postDelete/${id}`} className='w-full flex flex-col items-center justify-center'>
              <button 
              className='bg-red-500 w-full'
              >
                Delete Account
              </button>
            </Link>
            </div>
        </div>

        {errors && <p className='text-red-500'>{errors}</p>}
      </form>
    </div>
  );
}

