import connectDB from "@utils/database";
import user from "@models/user";
import { NextResponse } from "next/server";

export const GET = async(request, response) =>{
   
    await connectDB();

    try {
        let users = await user.find();
        users = users.map((u)=>{
          const {password, ...otherDetails} = u._doc;
          return otherDetails;
        })
        return new NextResponse(JSON.stringify(users), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    }catch(err){
        return new NextResponse(err.message, {
            status: 500,
        });
    }
}