import user from "@models/user";
import post from '@models/post';
import connectDB from '@utils/database'
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;

  try {
    await connectDB();

    // Find the current user
    const currentUser = await user.findById(id);

    let userPosts = [];
    if (currentUser) {
      // Get posts by the current user
      userPosts = await post.find({ userId: id });
    }

    // Get the list of users the current user is following
    const following = currentUser.following || [];

    // Find timeline posts based on the users the current user is following
    const followingPosts = await post.find({ userId: { $in: following } });

    // Concatenate user's posts and following's posts
    const timeLinePosts = userPosts.concat(...followingPosts);

    // Sort posts by creation date
    timeLinePosts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return new NextResponse(JSON.stringify(timeLinePosts), {
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
