import user from "@models/user";
import connectDB from "@utils/database";
import { NextResponse } from "next/server";
import reply from "@models/reply";



export const PUT = async (request, { params }) => {
  const { id } = params;
  const { author } = await request.json();

  try {
    await connectDB();
 
    const Reply = await reply.findById(id);
    const User = await user.findById(author);

    if (!Reply) {
      return new NextResponse("Post not found", {
        status: 404,
      });
    }

    if (!User) {
      return new NextResponse("SignUp to like", {
        status: 404,
      });
    }

    if (Reply.likes.includes(author)) {
      // Add like if userId is provided
      await Reply.updateOne({ $pull: { likes: author } });
    } else {
      // Remove like if userId is not provided
      await Reply.updateOne({ $push: { likes: author } });
    }

    // Fetch the updated reply after the update
    const updatedReply = await reply.findById(id);

    return new NextResponse(JSON.stringify(updatedReply), {
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
