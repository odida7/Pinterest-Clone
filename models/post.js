import mongoose from "mongoose";

const {Schema} = mongoose;

const postSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    text: {
        type: String,
    },
    image: {   
        type: String, 
    },   
    desc: {
        type: String,
    },
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'comment' 
    }],
    
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    }], 
    
}, 
  {timestamps: true}
)

export default mongoose.models.post || mongoose.model('post', postSchema); 