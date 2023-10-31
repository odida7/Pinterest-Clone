import post from "@models/post";
import user from "@models/user";
import comment from "@models/comment";
import connectDB from "@utils/database";
import { NextResponse } from "next/server";


//get post

export const GET = async (request, {params}) => {
    const {id} = params;
    await connectDB();
    try{ 
        const Post = await post.findById(id);
         return new NextResponse(JSON.stringify(Post), {
            status: 200,
              headers: {
                'Content-Type': 'application/json'
            }
        });
    }catch(err){
        return new NextResponse(err.message, {
            status: 500,
        });
    }
} 

//update post
export const PUT = async (request, { params }) => {
  const { id } = params;
  const { userId, text, image, desc } = await request.json();
  await connectDB();

  try {
    const updatePost = await post.findByIdAndUpdate(id, {userId, text, image, desc}, {new: true});
      return new NextResponse(JSON.stringify(updatePost), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });

    } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};

//delete post

export const DELETE = async (request, { params }) => {
  const { id } = params;
  await connectDB();

  try {
      await post.findByIdAndDelete({_id: id});  
      return new NextResponse('Post has been deleted', {
        status: 200,       
      });

    } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};


