



import user from "@models/user";
import connectDB from "@utils/database";
import { NextResponse } from "next/server";


export const PUT = async(request, {params}) => {
    const {id} = params;
    const {userId} = await request.json();

     if (id === userId){
            return new NextResponse('Action forbidden', {
                status: 403,
            })
        }


    try{
        await connectDB();

        const followUser = await user.findById(id);
        const currentUser = await user.findById(userId);

    

        if(followUser.followers.includes(userId)){
            await followUser.updateOne({$pull: {followers: userId}})
            await currentUser.updateOne({$pull: {following: id}})
            return new NextResponse('user unfollowed', {
                status: 200,
            })

        }else{
            await followUser.updateOne({$push: {followers: userId}})
            await currentUser.updateOne({$push: {following: id}})
            return new NextResponse('user has been followed', {
                status: 200,
            })
        }

    }catch(err){
        return new NextResponse(err.message, {
            status: 500,
        })
    }
}