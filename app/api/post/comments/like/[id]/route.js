import user from "@models/user";
import comment from "@models/comment";
import connectDB from "@utils/database";
import { NextResponse } from "next/server";
import post from "@models/post";


export const PUT = async (request, { params }) => {
  const { id } = params;
  const { _id, userId } = await request.json();

  try {
    await connectDB();
 
    const Comment = await comment.findById(_id);
    console.log('comments:', Comment);
    const Post = await post.findById(id);
    const User = await user.findById(userId);

    if (!Comment) {
      return new NextResponse("Comment not found", {
        status: 404,
      });
    }

    if (!User) {
      return new NextResponse("SignUp to like", {
        status: 404,
      });
    }


    if(Post) {
    if (Comment.likes.includes(userId)) {
      // Add like if userId is provided
      await Comment.updateOne({ $pull: { likes: userId } });
    } else {
      // Remove like if userId is not provided
      await Comment.updateOne({ $push: { likes: userId } });
    }
  }

    // Fetch the updated post after the update
    const updatedComment = await comment.findById(_id);

    return new NextResponse(JSON.stringify(updatedComment), {
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



