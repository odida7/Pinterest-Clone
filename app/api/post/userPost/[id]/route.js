import user from "@models/user";
import post from '@models/post';
import connetDB from '@utils/database'
import { NextResponse } from "next/server";


export const GET = async(request, {params})=> {
    const {id} = params;
        await connetDB();

     
    const User = await user.findById(id);

    try{ 

        if(User){
            const userPost = await post.find({userId: id});
            return new NextResponse(JSON.stringify(userPost), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }

    }catch(err){
        return new NextResponse(err.message, {
            status: 500,
        });
    }
}