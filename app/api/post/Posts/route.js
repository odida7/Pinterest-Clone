
import post from "@models/post";
import connectDB from "@utils/database";
import { NextResponse } from "next/server";

//create post


export const POST = async (request) => {
  const { userId, text, desc, comments, likes, image } = await request.json();
  
  await connectDB();
 
  try {
    if (userId) {  
      const newPost = new post({
        userId,
        text,
        image,
        desc, 
        comments,
        likes,
      });

      await newPost.save();

      // Assuming there's a field called 'createdAt' which indicates when the post was created
      //const sortedPosts = await post.find().sort({ createdAt: 1 }); // 1 for ascending, -1 for descending

      return new NextResponse(JSON.stringify(newPost), { 
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new NextResponse('Login to create post', {
        status: 401,
      });
    }
  } catch (err) {
    console.log(err)
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};


//get all posts

export const GET = async(request) => {
    await connectDB();

    try{
        const posts = await post.find();
        return new NextResponse(JSON.stringify(posts), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
        })

    }catch(err){
        return new NextResponse(err.message, {
            status: 500,
        });
    }
}

