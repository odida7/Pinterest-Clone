import post from "@models/post";
import user from "@models/user";
import connectDB from "@utils/database";
import { NextResponse } from "next/server";

export const PUT = async (request, { params }) => {
  const { id } = params;
  const { userId } = await request.json();

  try {
    await connectDB();
   
    const Post = await post.findById(id);  
    const User = await user.findById(userId);

    if (!Post) {
      return new NextResponse("Post not found", {
        status: 404,
      }); 
    }

    if (!User) {
      return new NextResponse("SignUp to like", {
        status: 404,
      });
    }

    if (Post.likes.includes(userId)) {
      // Add like if userId is provided
      await Post.updateOne({ $pull: { likes: userId } });
    } else {
      // Remove like if userId is not provided
      await Post.updateOne({ $push: { likes: userId } });
    }

    // Fetch the updated post after the update
    const updatedPost = await post.findById(id);

    return new NextResponse(JSON.stringify(updatedPost), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};
