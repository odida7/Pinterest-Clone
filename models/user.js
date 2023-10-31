import mongoose from "mongoose";

const {Schema} = mongoose;

const userSchema = new Schema({
    
    name: {
        type: String,
        unique: true,
        required: true, 
    },
    email: { 
        type: String,
        unique: true,
        required: true,  
    },
    proffession: {  
        type: String,  
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '', 
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
    }],


}, 
    {timestamps: true}
);


export default mongoose.models.user || mongoose.model("user", userSchema);