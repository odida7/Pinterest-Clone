import post from "@models/post";
import user from "@models/user";
import comment from "@models/comment";
import connectDB from "@utils/database";
import { NextResponse } from "next/server";

export const POST = async (request, { params }) => {
  const { id } = params;
  const { author, postId, conversation, likes, reply } = await request.json();

  try {
    await connectDB();
    const Post = await post.findById(id);
    //const posts = await post.findById(postId);
    //const commentor = await user.findById(author);

    // Create a new comment 
    let writeComment;
    if (Post) {
    
      writeComment = new comment({ author, postId, conversation, likes, reply });
      await writeComment.save();
    
    }
    

    // Initialize the comments array in the Post if it doesn't exist
    if (writeComment && Post.comments) {
      Post.comments.push(writeComment);
      await Post.save();
    }

    const updatedPost = await post.findById(id).populate('comments');
    return new NextResponse(JSON.stringify(updatedPost), {
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


//////////////////////Get comments

export const GET = async (request, { params }) => {
    const {id} = params;
    //const {postId} = await request.json();
  
    await connectDB();
    try{
        const Post = await post.findById(id);
       // const post = await post.findById(postId);
       if(Post){
        const commentData = await comment.find({postId: id});
        return new NextResponse(JSON.stringify(commentData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        })
       }
    }catch(err){
       return new NextResponse(err.message, {
            status: 500,
        });
    }
}


