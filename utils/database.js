import mongoose from "mongoose";
mongoose.set('strictQuery', false);

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
    }catch(error){
        throw new Error('connection failed')
    }
}

export default connectDB;