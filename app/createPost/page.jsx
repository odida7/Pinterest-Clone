'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';

export default function CreatePost() {
  const [image, setImage] = useState(null);
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

      const image = imageUrl;
      const text = e.target[1].value; 
      const desc = e.target[2].value;
      
        const res = await fetch('/api/post/Posts', {
        method: 'POST',
           headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user._id,
          image,
          text,
          desc,
        }), 
      });
      e.target.reset();
     
      if (res.status === 201) {
        router.push('/');
      } 
    
    } catch (err) {
      console.error(err);
      setErrors(err.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='mt-2 text-xl sm:text-4xl'>Create a new Post</h1>

      <form
        onSubmit={handleSubmit}
        className='p-4 sm:p-12 flex flex-col sm:flex-row gap-8 relative justify-between bg-white rounded-lg my-4 mx-0 sm:m-12'
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
          className='bg-gray-200 hover:bg-gray-300 flex flex-col items-center justify-center  w-72 sm:w-60 p-8'
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
            <p className='text-slate-500 text-lg font-bold'>Add Images</p>
          )}
        </div>  

        <div className='flex flex-col gap-6 items-center'>
          <div className='flex flex-col gap-2 items-center'>
            <textarea
              name='text'
              placeholder='What is on your mind?'
              cols='40'
              rows='5'
              className='border-b-2 border-slate-400 outline-none'
            />
          </div>

          <div className='flex flex-col gap-2 items-center'>
            <textarea
              name='desc'
              placeholder='Add Description'
              cols='40'
              rows='5'
              className='border-b-2 border-slate-400 outline-none'
            />
          </div>

          <button type='submit' className='bg-red-500 m-0 sm:m-2 sm:p-2  w-full'>
            Create
          </button>
        </div>

        {errors && <p className='text-red-500'>{errors}</p>}
      </form>
    </div>
  );
}
