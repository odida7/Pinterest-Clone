import mongoose from "mongoose";

const {Schema} = mongoose;

const replySchema = new Schema([{
    author: {
        type: String,
        ref: 'user',
        required: true,
    },
    text: {
        type: String,
    },
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    }], 
} 
    
],
  {timestamps: true}

);

export default mongoose.models.reply || mongoose.model('reply', replySchema);