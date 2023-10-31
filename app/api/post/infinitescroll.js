
import post from "@models/post";
import connectDB from "@utils/database";
import { NextResponse } from "next/server";

export const GET = async ({ query }) => {
    await connectDB();

    try {
        const page = parseInt(query.page) || 1; // Get the page number from the URL, default to 1
        const limit = 10; // Number of posts per page

        const skip = (page - 1) * limit; // Calculate how many posts to skip

        const Posts = await post.find().skip(skip).limit(limit); // Retrieve Posts for the specified page

        return new NextResponse(JSON.stringify(Posts), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } catch (err) {
        return new NextResponse(err.message, {
            status: 500,
        });
    }
}
