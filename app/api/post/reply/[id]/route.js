import user from "@models/user";
import comment from "@models/comment";
import connectDB from "@utils/database";
import { NextResponse } from "next/server";
import reply from "@models/reply";

export const POST = async (request, { params }) => {
  const { id } = params;
  const { author, text, likes } = await request.json();

  try {
    await connectDB();
    const postComment = await comment.findById(id);
    const replier = await user.findById(author);

    // Create a new reply
    let replyText;
    if (replier) {
      replyText = new reply({ author, text, likes });
      await replyText.save();
    }

    // Initialize the reply array in the comment if it doesn't exist
    if (replyText && postComment.reply) {
      postComment.reply.push(replyText);
      await postComment.save();
    }

    const updatedComment = await comment.findById(id).populate('reply');
    
    return new NextResponse(JSON.stringify(updatedComment), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error("Error:", err.message); 
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};

