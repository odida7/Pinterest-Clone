import connectDB from "@utils/database";
import user from "@models/user";
import { NextResponse } from "next/server";
import connetDB from '@utils/database'


export const GET = async(request, { params })=> {
    const { id } = params;
    await connetDB();
   
  
    try{
        await connectDB();
        const users = await user.findById(id);
        return new NextResponse(JSON.stringify(users), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
 
    }catch(err){
        return new NextResponse(err.message, {
            status: 500,
        });
    }
}
 
 

export const PUT = async (request, { params }) => {
  const { id } = params;
  const {name, proffession, image} = await request.json(); 

   try {
     await connectDB();
   
     const updated = await user.findByIdAndUpdate(id, { name, proffession, image }, { new: true });

      return new NextResponse(JSON.stringify(updated), {
       status: 200,
       headers: {
         'Content-Type': 'application/json'
       }
     });
   } catch (err) {
     return new NextResponse(err.message, {
      status: 500,
    });
  }

};


/////delete user



export const DELETE = async (request, { params }) => {
  const { id } = params;
  await connectDB();

  try {
      await user.findByIdAndDelete({_id: id});  
      return new NextResponse('user has been deleted', {
        status: 204,       
      });

    } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};

